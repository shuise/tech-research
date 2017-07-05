'use strict'
;export var chkDomain = function(str, protocol) {
    var domainArray = [
        '.com', '.net', '.org', '.biz', '.coop', '.info', '.museum', '.name',
        '.pro', '.edu', '.gov', '.int', '.mil', '.ac', '.ad', '.ae', '.af', '.ag',
        '.ai', '.al', '.am', '.an', '.ao', '.aq', '.ar', '.as', '.at', '.au', '.aw',
        '.az', '.ba', '.bb', '.bd', '.be', '.bf', '.bg', '.bh', '.bi', '.bj', '.bm',
        '.bn', '.bo', '.br', '.bs', '.bt', '.bv', '.bw', '.by', '.bz', '.ca', '.cc',
        '.cd', '.cf', '.cg', '.ch', '.ci', '.ck', '.cl', '.cm', '.cn', '.co', '.cr',
        '.cu', '.cv', '.cx', '.cy', '.cz', '.de', '.dj', '.dk', '.dm', '.do', '.dz',
        '.ec', '.ee', '.eg', '.eh', '.er', '.es', '.et', '.fi', '.fj', '.fk', '.fm',
        '.fo', '.fr', '.ga', '.gd', '.ge', '.gf', '.gg', '.gh', '.gi', '.gl', '.gm',
        '.gn', '.gp', '.gq', '.gr', '.gs', '.gt', '.gu', '.gv', '.gy', '.hk', '.hm',
        '.hn', '.hr', '.ht', '.hu', '.id', '.ie', '.il', '.im', '.in', '.io', '.iq',
        '.ir', '.is', '.it', '.je', '.jm', '.jo', '.jp', '.ke', '.kg', '.kh', '.ki',
        '.km', '.kn', '.kp', '.kr', '.kw', '.ky', '.kz', '.la', '.lb', '.lc', '.li',
        '.lk', '.lr', '.ls', '.lt', '.lu', '.lv', '.ly', '.ma', '.mc', '.md', '.me',
        '.mh', '.mk', '.ml', '.mm', '.mn', '.mo', '.mp', '.mq', '.mr', '.ms', '.mt',
        '.mu', '.mv', '.mw', '.mx', '.my', '.mz', '.na', '.nc', '.ne', '.nf', '.ng',
        '.ni', '.nl', '.no', '.np', '.nr', '.nu', '.nz', '.om', '.pa', '.pe', '.pf',
        '.pg', '.ph', '.pk', '.pl', '.pm', '.pn', '.pr', '.ps', '.pt', '.pw', '.py',
        '.qa', '.re', '.ro', '.rw', '.ru', '.sa', '.sb', '.sc', '.sd', '.se', '.sg',
        '.sh', '.si', '.sj', '.sk', '.sl', '.sm', '.sn', '.so', '.sr', '.st', '.sv',
        '.sy', '.sz', '.tc', '.td', '.tf', '.tg', '.th', '.tj', '.tk', '.tm', '.tn',
        '.to', '.tp', '.tr', '.tt', '.tv', '.tw', '.tz', '.ua', '.ug', '.uk', '.um',
        '.us', '.uy', '.uz', '.va', '.vc', '.ve', '.vg', '.vi', '.vn', '.vu', '.ws',
        '.wf', '.ye', '.yt', '.yu', '.za', '.zm', '.zw', '.mg'];
    var link = str;
    if(!protocol){
        link = 'http://' + link;
    }
    var location = getLocation(link);
    if(ValidateIPaddress(location.hostname)){
        return true;
    }
    var domain = location.hostname.replace(/^.+\./, '');
    if(domainArray.indexOf('.' + domain) < 0){
        return false;
    }
    return true;
};