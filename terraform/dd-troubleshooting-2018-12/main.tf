provider "datadog" {}

locals {
  app_name       = "Debtwire Company Subscriber"
  component_name = "debtwire-company-subscriber"
  env            = "live"
}

resource "datadog_timeboard" "subscriber-hackday" {
  title       = "Timeboard (created via Terraform) - ckelner Test"
  description = "created using the Datadog provider in Terraform"
  read_only   = false

  graph {
    autoscale = true
    title     = "memory for ${local.app_name}"

    request = {
      aggregator = "avg"
      q          = "avg:docker.mem.rss{$env,$component} by {container_name}"

      style = {
        palette = "dog_classic"
        type    = "solid"
        width   = "normal"
      }

      type = "line"
    }

    request = {
      q = "avg:docker.mem.limit{$env,$component}"

      style = {
        palette = "dog_classic"
        type    = "solid"
        width   = "normal"
      }

      type = "line"
    }

    viz = "timeseries"
  }

  graph {
    title = "cpu for ${local.app_name}"

    request = {
      aggregator = "avg"
      q          = "avg:docker.cpu.user{$env,$component} by {container_id}.fill(0)"

      style = {
        palette = "cool"
        type    = "solid"
        width   = "normal"
      }

      type = "line"
    }

    viz = "timeseries"
  }

  graph {
    title     = "Average response time"
    autoscale = false
    precision = "0"

    request = {
      aggregator = "max"

      conditional_format = {
        comparator = ">"
        palette    = "white_on_red"
        value      = "900"
      }

      conditional_format = {
        comparator = ">="
        palette    = "white_on_yellow"
        value      = "500"
      }

      conditional_format = {
        comparator = "<"
        palette    = "white_on_green"
        value      = "500"
      }

      q = "avg:app.web.response_time.median{$env,$component}"

      style = {
        palette = "dog_classic"
        type    = "solid"
        width   = "normal"
      }
    }

    text_align = "center"
    viz        = "query_value"
  }

  template_variable {
    name    = "env"
    default = "${local.env}"
  }

  template_variable {
    name    = "component"
    prefix  = "component"
    default = "${local.component_name}"
  }
}
