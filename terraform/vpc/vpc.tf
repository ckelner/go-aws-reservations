##########################################################################
############# CONFIGURATION ##############################################
##########################################################################

provider "aws" {
  region = "${var.aws_region}"
}

module "vpc" {
  source = "github.com/terraform-community-modules/tf_aws_vpc?ref=v1.0.3"
  name = "${var.vpc_name}"
  cidr = "${var.vpc_cidr_block}"
  public_subnets  = ["${var.subnet_cidr_blocks}"]
  enable_nat_gateway = "${var.nat_enabled}"
  azs = ["us-east-1a"] #hax
  tags {
    "Terraform" = "true"
  }
}

module "sg_web" {
  source = "github.com/terraform-community-modules/tf_aws_sg//sg_web"
  security_group_name = "kelnerhax-web"
  vpc_id = "${module.vpc.id}"
  source_cidr_block = "0.0.0.0/0"
}

##########################################################################
############# VARIABLES ##################################################
##########################################################################

variable "aws_region" {
  default = "us-east-1"
}
  
# Examples of undefined variable -- see vars.tfvars file
variable "vpc_cidr_block" {} # "10.0.0.0/16"

variable "subnet_cidr_blocks" {} # ["10.0.1.0/24"]
  
variable "vpc_name" {} # "kelnerhax"

