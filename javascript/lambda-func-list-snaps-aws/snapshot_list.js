//
// This lambda lists all snapshots and parses their description. If the
// AMI they were created for doesn't exist anymore, they are deleted.
//

var aws = require('aws-sdk');
aws.config.region = 'us-east-1';
var ec2 = new aws.EC2();
var my_re = /^Created by CreateImage\(.*\) for (.*) from .*$/;

exports.handler = function(event, context) {
    new aws.EC2().describeSnapshots({
          OwnerIds: [
              'self'
          ]
      },
      function(err, data) {
          for (var snap in data.Snapshots) {
              var snapshotid = data.Snapshots[snap].SnapshotId;
              var description_parsed = my_re.exec(data.Snapshots[snap].Description);
              if (description_parsed && description_parsed.length > 0) {
                  var ami = description_parsed[1];
              } else {
                console.log("[ERROR] Description invalid: " + data.Snapshots[snap].Description);
                console.log(JSON.stringify(data));
              }
              describe(ami, snapshotid);
          }
      }
    );
};

function describe(ami, snapshotid) {
    new aws.EC2().describeImages({
        Owners: [
            'self'
        ],
        ImageIds: [
            ami
        ]
    }, function(error_di, data_di) {
        if (error_di) {
            if (error_di.code === 'InvalidAMIID.NotFound') {
                console.log(error_di.message);
                new aws.EC2().deleteSnapshot(
                    { SnapshotId: snapshotid },
                    function(err_ds, data_ds) {
                        if (err_ds) {
                            console.log(
                                "Could not delete: " +
                                snapshotid +
                                " (" +
                                ami +
                                ")" +
                                err_ds +
                                " " +
                                err_ds.stack
                            );
                        } else {
                            console.log(
                                "\tSnapshot deleted (" + ami +
                                "): " + snapshotid
                            );
                        }
                    }
                );
            } else {
                console.log("Actual Error: " + JSON.stringify(error_di)); // a real error occurred
            }
        }
    });
}
