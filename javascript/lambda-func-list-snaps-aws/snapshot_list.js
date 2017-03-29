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

      //console.log("snapshotid: " + snapshotid);
      //console.log("Description: " + description);

      my_re = /^Created by CreateImage\(.*\) for (.*) from .*$/;

      var description_parsed = my_re.exec(description);
      if (description_parsed && description_parsed.length > 0) {
        var ami = description_parsed[1];
        //console.log ("Snapshot " + snapshotid + " associated with " + ami);

        new aws.EC2().describeImages({
          Owners: [
            'self'
          ],
          ImageIds: [
            ami
          ]
        },function(error_di, data_di) {
          // console.log("data_di ======== " + JSON.stringify(data_di));
          // data_di.Images.ImageId
          if (error_di) {
            //console.log("error_di ======== " + JSON.stringify(error_di));
            /*
            {
                "message": "The image id '[ami-2b8a3040]' does not exist",
                "code": "InvalidAMIID.NotFound",
                "time": "2017-03-29T18:13:25.276Z",
                "requestId": "ca558b7a-0fc5-4494-9bc9-773af76ec31d",
                "statusCode": 400,
                "retryable": false,
                "retryDelay": 44.98776595376286
            }
            */
            if (error_di.code === 'InvalidAMIID.NotFound'){
              console.log ( error_di.message );

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
