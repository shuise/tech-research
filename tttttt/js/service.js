let SYService = (function (depends) {
  let { SYUtils: utils, RongIMLib } = depends;
  let { RongIMClient } = RongIMLib;

  let User = {};
  let current = {};
  User.get = () => {
    return utils.Defer.resolve(current);
  };
  /* 
    let user = {
      id: 'idad',
      password: '123456'
    };
  */
  // User.login = (user) => {
  //   let mocks = {
  //     martin9901: 'zfTFPNMsBeWldOnYXPatALrkPG6U/xPk3zvPIWf9le1SBPSgLjmhzAb+HsGRqX7qFIGnACOwUS1fiv9iBuGkHvq2I3apBmAF',
  //     martin9902: 'k50rMDIBKEdtaVJ41xED8m20V27XsDF2Dx+bgnMVAZjUBp+2UrNZB61v27+yj/2Okf+X2ZBzTanhPG/Rj1hc7BisfLXukXuN',
  //     tester001: 'r9/00e6ohd0tzM8xXRYiXMSkAMimzaj6nB20cRPaYWTGWNjZGMp1UmlOvXAR4PhjtJro0iBg7yHv4/m2DJrtPw=='
  //   };
  //   return utils.deferred((resolve, reject) => {
  //     let { id } = user;
  //     let token = mocks[id];
  //     if (token) {
  //       current = {
  //         id
  //       };
  //       resolve({
  //         token
  //       });
  //     } else {
  //       reject();
  //     }
  //   });
  // };
  /* 
    let user = {
      id: 'id'
    };
  */
  User.getRTCToken = (user, option) => {
    option = option || {};
    let { appkey, url } = option;
    return utils.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `uid=${user.id}&appid=${appkey}`
    });
  }

  let Chatroom = {};

  /* 
    let room = {
      id: 'roomId1'
    }
  */
  Chatroom.join = (room) => {
    return utils.deferred((resolve, reject) => {
      let { id } = room;
      let count = 0;
      RongIMClient.getInstance().joinChatRoom(id, count, {
        onSuccess: resolve,
        onError: reject
      });
    });
  };
  Chatroom.leave = (room) => {
    return utils.deferred((resolve, reject) => {
      let { id } = room;
      RongIMClient.getInstance().quitChatRoom(id, {
        onSuccess: resolve,
        onError: reject
      });
    });
  };
  /* 
   let room = {
     id: 'roomId1'
   };
   let message = {
     name: 'CustomMessage',
     content: {
       name: ‘zzhangsan’
     }
   };
 */
  let getMessage = ({ name, content }) => {
    return new RongIMClient.RegisterMessage[name](content);
  };
  Chatroom.send = (room, message) => {
    return utils.deferred((resolve, reject) => {
      let { id } = room;
      let conversationType = RongIMLib.ConversationType.CHATROOM;
      let msg = getMessage(message);
      RongIMClient.getInstance().sendMessage(conversationType, id, msg, {
        onSuccess: resolve,
        onError: reject
      });
    });
  };

  let MessageType = {
    MuteMessage: 'MuteMessage',
    UnmuteMessage: 'UnmuteMessage'
  };
  return {
    User,
    Chatroom,
    MessageType
  };
})({
  SYUtils,
  RongIMLib
});