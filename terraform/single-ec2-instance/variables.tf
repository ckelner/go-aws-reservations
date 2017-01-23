variable "aws_region" {
  default = "us-east-1"
}

variable "amis_community_ubuntu_1404" {
  default = {
    us-east-1 = "ami-7b386c11"
    us-west-2 = "ami-86e0ffe7"
    us-west-1 = "ami-b085eed0"
    eu-central-1 = "ami-4789952b"
    eu-west-1 = "ami-5a60c229"
    ap-southeast-1 = "ami-be5794dd"
    ap-southeast-2 = "ami-c499c2a7"
    ap-northeast-1 = "ami-c0586dae"
    sa-east-1 = "ami-a0880fcc"
  }
}

variable "number_of_instances" {
  default = "1"
}

variable "instance_type" {
  default = "t2.micro"
}
