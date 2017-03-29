//
// This lambda lists all snapshots and parses their description. If the
// AMI they were created for doesn't exist anymore, they are deleted.
//

var aws = require('aws-sdk');

aws.config.region = 'us-east-1';

var ec2 = new aws.EC2();

exports.handler = function(event, context) {
  ec2.describeSnapshots({
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
        // console.log("Snapshot " + snapshotid + " associated with " + ami);

        if (!ami_exists (ami)){
          console.log( "AMI:" + ami + " doesn't exist" );

          var snapparams = {
            SnapshotId: snapshotid
          };
          ec2.deleteSnapshot(snapparams, function(err_ds, data_ds) {
            if (err) {
              console.error("Could not delete: "
                              + snapshot
                              + " "
                              + err_ds
                              + " "
                              + err_ds.stack);
            } else {
              console.log("\tSnapshot deleted: " + snapshot);
            }
          });
        }else{
          console.log ("AMI: " + ami + " exists, leave it ")
        }
      }
    }
  });
}

// Function defaults to thinking an AMI exists. Only returns false if we get
// InvalideAMIID from AWS.
function ami_exists (ami) {
  status = true ; // default to AMI existing

  var ec2ami = new aws.EC2();

  ec2ami.describeImages({
    Owners: [
      'self'
    ],
    ImageIds: [
      ami
    ]
  },
  function(err, data) {
    if (err) {
      // console.log("AMI Error: " + ami + err, err.stack);
      if (err.code === 'InvalidAMIID.NotFound'){
        console.log ( "AMI Not found:" + ami );
        status = false;
      } else {
        console.error ("AMI Lookup:" + err, err.stack);
      }
    }
  });

  return status;
}
