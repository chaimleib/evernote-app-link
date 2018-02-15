// ==UserScript==
// @name         Evernote app link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  On a note page, insert app link to the note
// @author       Chaim Leib Halbert
// @match        https://www.evernote.com/shard/s*
// @grant        none
// @require      https://code.jquery.com/jquery-latest.min.js
// @updateURL   https://raw.githubusercontent.com/chaimleib/evernote-app-link/master/evernote-app-link.js
// @downloadURL   https://raw.githubusercontent.com/chaimleib/evernote-app-link/master/evernote-app-link.js
// ==/UserScript==

(function() {
    'use strict';
    // https://[service]/shard/[shardId]/nl/[userId]/[noteGuid]/
    // * [service] is the name of the Evernote service (either sandbox.evernote.com or www.evernote.com)
    // * [userId] is the user ID of the notebook owner
    // * [shardId] is the shard ID where the note is stored
    // * [noteGuid] is the GUID of the note that is being linked to
    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function(search, pos) {
            return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
        };
    }
    function _noteLink2noteObj(url) {
        url = url.toString();
        if (!url || !url.startsWith("https://")) {
            return null;
        }
        var parts = url.split("/", 9);
        if (parts.length < 8 || parts[3] != "shard" || parts[5] != "nl") {
            return null;
        }
        var result = {
            service: parts[2],
            userId: parts[6],
            shardId: parts[4],
            noteGuid: parts[7],
            extras: parts.slice(8)
        };
        return result;
    }
    function noteLink2noteObj(url) {
        var result = _noteLink2noteObj(url);
        if (!result) {
            console.error("error: noteLink2noteObj(\"" + url + "\")");
        }
        return result;
    }
    // evernote:///view/[userId]/[shardId]/[noteGuid]/[noteGuid]/
    // * [userId] is the user id of the notebook owner
    // * [shardId] is the shard id of the notebook owner
    // * [noteGuid] is the guid of the note that is being linked to
    function noteObj2appLink(note) {
        if (!note) {
            return null;
        }
        return [
            "evernote:///view",
            note.userId,
            note.shardId,
            note.noteGuid,
            note.noteGuid,
            "",
        ].join("/");
    }

    function linkButton(url) {
        var aTag = $("<a>");
        aTag.text("Open in Evernote");
        aTag.attr("href", url);
        return aTag;
    }
    var noteObj = noteLink2noteObj(window.location);
    var appLink = noteObj2appLink(noteObj);
    console.log(appLink);
    var lb = linkButton(appLink);
    $(".sharing-imagegallery").prepend(lb);
})();

