//
// This lambda lists all snapshots and parses their description. If the
// AMI they were created for doesn't exist anymore, they are deleted.
//

var aws = require('aws-sdk');

aws.config.region = 'us-east-1';

var ec2 = new aws.EC2();

exports.handler = function(event, context) {
  new aws.EC2().describeSnapshots({
    OwnerIds: [
      'self'
    ]
  },
  function(err, data) {
    for (var snap in data.Snapshots) {
      var snapshotid = data.Snapshots[snap].SnapshotId;
      var description = data.Snapshots[snap].Description;

      my_re = /^Created by CreateImage\(.*\) for (.*) from .*$/;

      var description_parsed = my_re.exec(description);
      if (description_parsed && description_parsed.length > 0) {
        ami = description_parsed[1];
        //console.log ("Snapshot " + snapshotid + " associated with " + ami);

        new aws.EC2().describeImages({
          Owners: [
            'self'
          ],
          ImageIds: [
            ami
          ]
        },function(error_di, data_di) {
          if (error_di) {
            if (error_di.code === 'InvalidAMIID.NotFound'){
              console.log ( "AMI: " + ami + " doesn't exist " + snapshotid );

              var snapparams = {
                SnapshotId: snapshotid
              };
              new aws.EC2().deleteSnapshot(snapparams, function(err_ds, data_ds) {
                if (err_ds) {
                  console.log("Could not delete: "
                                  + snapshotid
                                  + " ("
                                  + ami
                                  + ")"
                                  + err_ds
                                  + " "
                                  + err_ds.stack);
                } else {
                  console.log("\tSnapshot deleted (" + ami + "): " + snapshotid);
                }
              });
            } else {
              console.log("Actual Error: " + error_di); // a real error occurred
            }
          } else {
            //console.log("AMI Exists: " + ami); // request succeeded
          }
        });
      }
    }
  });
}
