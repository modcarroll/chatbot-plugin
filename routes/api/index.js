var express = require('express');
var router = express.Router();
var watson = require('watson-developer-cloud');

// Instantiate the Watson Conversation Service as per WDC 2.2.0
var conversation = new watson.ConversationV1({
  version_date: '2017-05-26'
});

// Endpoint to be called from the client side
router.post('/message', function(req, res) {
  var workspace = process.env.WORKSPACE_ID || '<workspace-id>';
  if (!workspace || workspace === '<workspace-id>') {
    return res.json({
      'output': {
        'text': 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable.'
      }
    });
  }
  var payload = {
    workspace_id: workspace,
    context: {},
    input: {}
  };

  if (req.body) {
    if (req.body.input) {
      payload.input = req.body.input;
    }
    if (req.body.context) {
      payload.context = req.body.context;
    }

    conversation.message(payload, function(err, data) {
      var returnObject = null;
      if (err) {
        console.error(JSON.stringify(err, null, 2));
        returnObject = res.status(err.code || 500).json(err);
      } else {
        returnObject = res.json(data);
      }
      return returnObject;
    });
  }
});

module.exports = router;
