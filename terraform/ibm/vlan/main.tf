provider "ibmcloud" {
  ibmid                    = "${var.ibmid}"
  ibmid_password           = "${var.ibmidpw}"
  softlayer_account_number = "${var.slaccountnum}"
}

# Create a public vlan
resource "ibmcloud_infra_vlan" "test_vlan_public" {
  name            = "public-kelner-test"
  datacenter      = "${var.datacenter}"
  type            = "PUBLIC"
  subnet_size     = 8
}

# Create a private vlan
resource "ibmcloud_infra_vlan" "test_vlan_private" {
  name        = "private-kelner-test"
  datacenter  = "${var.datacenter}"
  type        = "PRIVATE"
  subnet_size = 8
}

# Required for the IBM Cloud provider
variable ibmid {
  type = "string"
  description = "Your IBM-ID."
}
# Required for the IBM Cloud provider
variable ibmidpw {
  type = "string"
  description = "The password for your IBM-ID."
}
# Required to target the correct SL account
variable slaccountnum {
  type = "string"
  description = "Your Softlayer account number."
}
# The datacenter to deploy to
variable datacenter {
  default = "dal06"
