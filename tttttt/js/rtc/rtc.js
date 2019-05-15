let SYRTC = (function (depends) {
  var { SYUtils: utils, RongRTCEngine: RongRTC, RongRTCEngineEventHandle: RongRTCHandler } = depends;
  var Config = {}, rongRTC = null, RTCMeeting = null, isJoinRoom = false;
  const PromiseCacheKey = {
    MANAGER: 'request_to_manager',
    MUTE: 'meeting_mute',
    UNMUTE: 'meeting_unmute',
    DISABLE: 'meeting_disable',
    ENABLE: 'meeting_enable'
  };
  const DeviceType = {
    VIDEO: 1,
    AUDIO: 2,
    AUDIO_AND_VIDEO: 3
  };
  const OperationType = {
    OPEN: 1,
    CLOSE: 2
  };

  let PromiseCache = utils.Cache();
  let RoomCache = utils.Cache();
  let roomWatcher = new utils.Observer();
  let streamWatcher = new utils.Observer();
  let meetingWatcher = new utils.Observer();

  let currentUser = {};

  let isJoined = () => {
    return isJoinRoom;
  };
  let reset = () => {
    isJoinRoom = false;
    PromiseCache.clear();
    RoomCache.clear();
  };
  let getJoinKey = (user) => {
    let id = user.id || user.userId;
    return utils.tplEngine('{id}_join', {
      id
    });
  };
  let getLeaveKey = (user) => {
    let id = user.id || user.userId;
    return utils.tplEngine('{id}_leave', {
      id
    });
  };
  let getWBKey = () => {
    return 'wb_path';
  };
  /* Room 开始 */
  /* 
    let user = {
      id: '',
      token: '',
      roomId: ''
    };
  */
  let joinRoom = (user) => {
    if (isJoined()) {
      return utils.Defer.resolve();
    }
    isJoinRoom = true;
    return utils.deferred((resolve, reject) => {
      let { id, token, roomId } = user;
      let key = getJoinKey(user);
      rongRTC.joinChannel(roomId, id, token);
      RoomCache.set('roomId', roomId);
      currentUser = user;
      PromiseCache.set(key, {
        resolve,
        reject
      });
    });
  };
  let leaveRoom = (user) => {
    reset();
    return utils.deferred((resolve, reject) => {
      let key = getLeaveKey(user);
      let { roomId } = user;
      rongRTC.leaveChannel(roomId);
      PromiseCache.set(key, {
        resolve,
        reject
      });
    });
  };
  let watchRoom = (watcher) => {
    roomWatcher.add(watcher);
  };
  /* Room 结束 */

  /* Stream 开始 */
  let watchStream = (watcher) => {
    streamWatcher.add(watcher);
  };

  let isCurrent = (user) => {
    return utils.isEqual(user.id, currentUser.id);
  };

  let getStream = (user) => {
    if (isCurrent(user)) {
      return rongRTC.getLocalStream();
    }
    return rongRTC.getRemoteStream(user.id);
  };
  /* 
    传入当前用户关闭本地摄像头，传入其他用户关闭指定用户摄像头
    let user = {
      id: 'userId1'
    };
  */
  let disable = (user) => {
    if (isCurrent(user)) {
      rongRTC.changeVideo(false)
    } else {

    }
  };
  let enable = (user) => {
    if (isCurrent(user)) {
      rongRTC.changeVideo(true)
    } else {

    }
  };
  let mute = (user) => {
    if (isCurrent(user)) {
      rongRTC.changeMicPhone(false)
    } else {

    }
  };
  let unmute = (user) => {
    if (isCurrent(user)) {
      rongRTC.changeMicPhone(true)
    } else {

    }
  };
  /* Stream 结束 */

  /* 会控 开始 */
  let meetingWatch = (watcher) => {
    meetingWatcher.add(watcher);
  };

  // 请求成为主持人
  let requestToManager = () => {
    return utils.deferred((resolve, reject) => {
      PromiseCache.set(PromiseCacheKey.MANAGER, {
        resolve,
        reject
      });
      RTCMeeting.getHostPower();
    });
  };
  let muteUser = (user) => {
    return utils.deferred((resolve, reject) => {
      PromiseCache.set(PromiseCacheKey.MUTE, {
        resolve,
        reject
      });
      RTCMeeting.hostRequestControlUserDevice(user.id, DeviceType.AUDIO, OperationType.CLOSE);
    });
  };
  let unmuteUser = (user) => {
    return utils.deferred((resolve, reject) => {
      PromiseCache.set(PromiseCacheKey.UNMUTE, {
        resolve,
        reject
      });
      RTCMeeting.hostRequestControlUserDevice(user.id, DeviceType.AUDIO, OperationType.OPEN);
    });
  };
  let disableUser = (user) => {
    return utils.deferred((resolve, reject) => {
      PromiseCache.set(PromiseCacheKey.DISABLE, {
        resolve,
        reject
      });
      RTCMeeting.hostRequestControlUserDevice(user.id, DeviceType.VIDEO, OperationType.CLOSE);
    });
  };
  let enableUser = (user) => {
    return utils.deferred((resolve, reject) => {
      PromiseCache.set(PromiseCacheKey.ENABLE, {
        resolve,
        reject
      });
      RTCMeeting.hostRequestControlUserDevice(user.id, DeviceType.VIDEO, OperationType.OPEN);
    });
  };
  /* 会控 结束 */

  /* 白板 开始 */
  let requestWhiteboard = () => {
    return utils.deferred((resolve, reject) => {
      let key = getWBKey();
      PromiseCache.set(key, {
        resolve,
        reject
      });
      rongRTC.requestWhiteBoardURL();
    });
  };
  /* 白板 结束 */

  let registerEvents = () => {
    var rongRTCHanlder = new RongRTCHandler();
    let events = {
      onJoinComplete: (user) => {
        let { isJoined } = user;
        let key = getJoinKey(user);
        let promise = PromiseCache.get(key);
        if (!isJoined) {
          return promise.reject(user);
        }
        return promise.resolve();
      },
      onLeaveComplete: (user) => {
        var isLeft = user.isLeft;
        let key = getLeaveKey(currentUser);
        let promise = PromiseCache.get(key);
        if (isLeft) {
          rongRTC.closeLocalStream();
          promise.resolve();
        } else {
          promise.reject(user);
        }
      },
      onUserJoined: ({ userId: id }) => {
        roomWatcher.emit({
          type: 'joined',
          user: {
            id
          }
        });
      },
      onUserLeft: ({ userId: id }) => {
        roomWatcher.emit({
          type: 'left',
          user: {
            id
          }
        });
      },
      onaddstream: ({ userId: id }) => {
        let node = rongRTC.createRemoteVideoView(id)
        streamWatcher.emit({
          id,
          node
        });
      },
      onConnectionStateChanged: () => {

      },
      // 请求白板回调事件
      onWhiteBoardURL: ({ url, isSuccess }) => {
        let key = getWBKey();
        let promise = PromiseCache.get(key);
        if (isSuccess) {
          promise.resolve(url);
        } else {
          promise.reject();
        }
      },
      /* 房间中人员被踢 */
      kickUser: function (data) {
        utils.extend(data, {
          type: 'kickUser'
        });
        meetingWatcher.emit(data);
      },
      /* 请求主持人成功 */
      onRequestAnchorSuccess: function () {
        let promise = PromiseCache.get(PromiseCacheKey.MANAGER);
        if (promise) {
          promise.resolve();
        }
      },
      /* 请求主持人失败 */
      onRequestAnchorFailed: function (error) {
        let promise = PromiseCache.get(PromiseCacheKey.MANAGER);
        if (promise) {
          promise.reject(error);
        }
      },
      /* 主持人改变 */
      onAnchorChanged: function (data) {
        utils.extend(data, {
          type: 'onAnchorChanged'
        });
        meetingWatcher.emit(data);
      },
      /* 房间内其他成员设备改变 */
      onOtherDeviceChanged: function (data) {
        utils.extend(data, {
          type: 'onOtherDeviceChanged'
        });
        meetingWatcher.emit(data);
      },
      /* 用户成为观察者 */
      onUserToViewer: function (data) {
        utils.extend(data, {
          type: 'onUserToViewer'
        });
        // meetingWatcher.emit(data);
      },
      /* 观察者成为用户 */
      onViewerToUser: function (data) {
        utils.extend(data, {
          type: 'onViewerToUser'
        });
        // meetingWatcher.emit(data);
      },
      /* 观察者请求成为用户 */
      onViewerRequestToUser: function (data) {
        utils.extend(data, {
          type: 'onViewerRequestToUser'
        });
        // meetingWatcher.emit(data);
      },
      /* 请求关闭设备 */
      onRequestUpdateDevice: function (data) {
        utils.extend(data, {
          type: 'onRequestUpdateDevice'
        });
        // meetingWatcher.emit(data);
      },
      /* 观察者同意成为用户 */
      onViewerAcceptToUser: function (data) {
        utils.extend(data, {
          type: 'onViewerAcceptToUser'
        });
        // meetingWatcher.emit(data);
      },
      /* 观察者拒绝成为用户 */
      onViewerRejectToUser: function (data) {
        utils.extend(data, {
          type: 'onViewerRejectToUser'
        });
        // meetingWatcher.emit(data);
      },
      /* 主持人同意成为用户 */
      onAnchorAcceptToUser: function (data) {
        utils.extend(data, {
          type: 'onAnchorAcceptToUser'
        });
        // meetingWatcher.emit(data);
      },
      /* 主持人拒绝成为用户 */
      onAnchorRejectToUser: function (data) {
        utils.extend(data, {
          type: 'onAnchorRejectToUser'
        });
        // meetingWatcher.emit(data);
      },
      /* 用户同意成为观察者 */
      onUserAcceptToViewer: function (data) {
        utils.extend(data, {
          type: 'onUserAcceptToViewer'
        });
        // meetingWatcher.emit(data);
      },
      /* 用户拒绝成为观察者 */
      onUserRejectToViewer: function (data) {
        utils.extend(data, {
          type: 'onUserRejectToViewer'
        });
        // meetingWatcher.emit(data);
      },
      /* 主持人控制设备，用户收到的通知 */
      OnHostRequestControlDevice: function(data){
        utils.extend(data, {
          type: 'onUserAcceptUpdateDevice'
        });
        meetingWatcher.emit(data);
      },
      /* 用户同意修改摄像头、麦克风 */
      onUserAcceptUpdateDevice: function (data) {
        utils.extend(data, {
          type: 'onUserAcceptUpdateDevice'
        });
        meetingWatcher.emit(data);
      },
      /* 用户拒绝修改摄像头、麦克风 */
      onUserRejectUpdateDevice: function (data) {
        utils.extend(data, {
          type: 'onUserRejectUpdateDevice'
        });
        meetingWatcher.emit(data);
      }
    };
    utils.forEach(events, (event, name) => {
      rongRTCHanlder.on(name, event);
    });
    rongRTC.setRongRTCEngineEventHandle(rongRTCHanlder);
  };

  let init = (config) => {
    config = config || {};
    utils.extend(Config, config);
    let { url } = config;
    rongRTC = new RongRTC(url);
    RTCMeeting = rongRTC.rongRTCMeeting;
    registerEvents();

    return {
      Room: {
        join: joinRoom,
        leave: leaveRoom,
        watch: watchRoom
      },
      Stream: {
        get: getStream,
        disable: disable,
        enable: enable,
        mute: mute,
        unmute: unmute,
        watch: watchStream
      },
      Whiteborad: {
        get: requestWhiteboard
      },
      MeetingManager: {
        watch: meetingWatch,
        Manager: {
          request: requestToManager
        },
        User: {
          mute: muteUser,
          unmute: unmuteUser,
          disable: disableUser,
          enable: enableUser
        }
      }
    };
  };
  return {
    init
  };
})({
  SYUtils,
  RongRTCEngine,
  RongRTCEngineEventHandle
});