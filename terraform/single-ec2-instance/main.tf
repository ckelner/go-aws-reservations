##########################################################################
############# CONFIGURATION ##############################################
##########################################################################

provider "aws" {
  region = "${var.aws_region}"
}

module "vpc" {
  source = "github.com/terraform-community-modules/tf_aws_vpc?ref=v1.0.3"
  name = "kelnerhax"
  cidr = "10.0.0.0/16"
  public_subnets  = ["10.0.1.0/24"]
  map_public_ip_on_launch = true
  enable_nat_gateway = false
  enable_dns_support = true
  enable_dns_hostnames = true
  azs = ["us-east-1a"]
  tags {
    "Terraform" = "true"
  }
}

module "sg_web_open_to_the_world" {
  # run off master, no version
  source = "github.com/terraform-community-modules/tf_aws_sg//sg_web"
  security_group_name = "kelner-hax-web"
  # get vpc id from module
  vpc_id = "${module.vpc.vpc_id}"
  source_cidr_block = "0.0.0.0/0" # the world - hax
}

resource "aws_security_group" "main_security_group" {
    name = "Kelnerhax-SSH-testing"
    description = "test"
    # get vpc id from module
    vpc_id = "${module.vpc.vpc_id}"
    # allows traffic from the SG itself for tcp
    ingress {
      from_port = 0
      to_port = 65535
      protocol = "tcp"
      self = true
    }
    # allows traffic from the SG itself for udp
    ingress {
      from_port = 0
      to_port = 65535
      protocol = "udp"
      self = true
    }
    ingress {
      from_port = 22
      to_port = 22
      protocol = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
    egress {
      from_port = 0
      to_port = 0
      protocol = "-1"
      cidr_blocks = ["0.0.0.0/0"]
    }
}

resource "aws_key_pair" "ssh_key" {
  key_name   = "ssh_key_kelnerhax"
  public_key = "${var.public_key_material}"
}

resource "aws_instance" "ec2_instance" {
  ami = "${lookup(var.amazon_linux_2016091_HVM_SSD, var.aws_region)}"
  count = "${var.number_of_instances}"
  subnet_id = "${module.vpc.public_subnets[0]}"
  instance_type = "${var.instance_type}"
  key_name = "${aws_key_pair.ssh_key.key_name}"
  vpc_security_group_ids = ["${aws_security_group.main_security_group.id}","${module.sg_web_open_to_the_world.security_group_id_web}"]
  # Installs nginx web server on our VM via SSH
  provisioner "remote-exec" {
    connection {
        type = "ssh"
        user = "ec2-user"
        # This is stored in a file not checked into source control
        private_key = "${var.private_key_material}"
    }
    inline = [
      # "sudo yum update -y", # Uncomment to enable updates; quicker provisioning without for demo purposes
      # Install nginx
      "sudo yum install -y nginx",
      # Overwrite default nginx welcome page
      "echo \"<h1>I am Kelner</h1>\" | sudo tee /usr/share/nginx/html/index.html"
    ]
  }
  tags {
    "Terraform" = "true"
    "Name" = "kelnerhax-testing"
  }
}

##########################################################################
############# VARIABLES ##################################################
##########################################################################

variable "aws_region" {
  default = "us-east-1"
}

variable "availability_zones" {
  default     = "us-east-1a"
  description = "List of availability zones, use AWS CLI to find your "
}

variable "asg_min" {
  description = "Min numbers of servers in ASG"
  default     = "1"
}

variable "asg_max" {
  description = "Max numbers of servers in ASG"
  default     = "2"
}

variable "asg_desired" {
  description = "Desired numbers of servers in ASG"
  default     = "1"
}

variable "amazon_linux_2016091_HVM_SSD" {
  default = {
    us-east-1 = "ami-9be6f38c" # US East (N. Virginia)
    us-east-2 = "ami-38cd975d" # US East (Ohio)
    us-west-1 = "ami-b73d6cd7" # US West (N. California)
    us-west-2 = "ami-1e299d7e" # US West (Oregon)
    ca-central-1 = "ami-eb20928f" # Canada (Central)
    eu-west-1 = "ami-c51e3eb6" # EU (Ireland)
    eu-west-2 = "ami-bfe0eadb" # EU (London)
    eu-central-1 = "ami-211ada4e" # EU (Frankfurt)
    ap-southeast-1 = "ami-4dd6782e" # Asia Pacific (Singapore)
    ap-southeast-2 = "ami-28cff44b" # Asia Pacific (Sydney)
    ap-northeast-1 = "ami-9f0c67f8" # Asia Pacific (Tokyo)
    ap-northeast-2 = "ami-94bb6dfa" # Asia Pacific (Seoul)
    ap-south-1 = "ami-9fc7b0f0" # Asia Pacific (Mumbai)
    sa-east-1 = "ami-bb40d8d7" # South America (São Paulo)
  }
}

variable "amis_community_ubuntu_1604LTS_HVM_SSD" {
  default = {
    us-east-1 = "ami-6edd3078"
    us-west-2 = "ami-7c803d1c"
    us-west-1 = "ami-539ac933"
    eu-central-1 = "ami-5aee2235"
    eu-west-1 = "ami-d8f4deab"
    ap-southeast-1 = "ami-b1943fd2"
    ap-southeast-2 = "ami-fe71759d"
    ap-northeast-1 = "ami-eb49358c"
    sa-east-1 = "ami-7379e31f"
  }
}

variable "number_of_instances" {
  default = "1"
}

variable "instance_type" {
  default = "t2.micro"
}

# This is stored in a file not checked into source control or passed in via command line or stored as a secret in a service wrapping terraform -- should be used with public_key_material (should be of the same key)
variable "private_key_material" {
  description = "The private key material used to connect via SSH; define in terraform.tfvars or if using a service like Terraform Enterprise define it there."
}

variable "public_key_material" {
  description = "Ideally this is defined in terraform.tfvars - users of this should override it there, or in their terraform service of choice. For simplicity sake I have defined a default value here, but this will not work without the private key."
  default = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDQEXzbz7uCQWfbWycU97ucC+Ka4yzwBebVbx5XuABCGybKzEjVcn2oYGWUOvxxckbg+bku6KyBfR8Aq4Ajz1ygeXl+1fuqaNVgj0BJKc9jzMdfYi53/gJzq7hypIQUcxdxu/UJiC79E7SEKpZ8DVETC4IqFe5mHVgeEyvXcXX8Xjb6xs1mCkNTAIfTc0UtZlGnKJZu3bEDvAw1/kqfpdDEuKVSqsEkjzF3cKNOATa2MRmU8djv/kS8rUhsuBKLqwAb4Brz3bo7hQtXlC8+kGuSMaKdC/Nds83hk5aX+wgGawGihlQhDRwJRgpBDAZSzT5ZIJ2Fz1BudXQnZ6tcps99 chris.kelner@weather.com"
}
