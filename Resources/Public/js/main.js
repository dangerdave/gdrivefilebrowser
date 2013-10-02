/* Autor: David Steindl
 * Date: 01.08.2013
 * Google Drive SDK: https://developers.google.com/drive/ 
 */
getCLIENT_ID = "";
var SCOPES = 'https://www.googleapis.com/auth/drive';

/**
* Called when the client library is loaded to start the auth flow.
*/
function handleClientLoad() {
	window.setTimeout(checkAuth, 1);
}

/**
* Check if the current user has authorized the application.
*/
function checkAuth(displayStatus) {
	displayStatus = displayStatus || 1;
	getGaName = $('.ganame_'+displayStatus).html();
	$('#accountSelectName').html(getGaName);
	getCLIENT_ID = $('.token_'+displayStatus).html();
	$('.activate_'+displayStatus).find('.t3-icon-edit-unhide').addClass('activate_hide');
	$('.activate_'+displayStatus).find('.t3-icon-edit-add').removeClass('activate_hide');
	gapi.auth.authorize({'client_id': getCLIENT_ID, 'scope': SCOPES, 'immediate': true}, handleAuthResult);
}

/**
* Called when authorization server replies.
*
* @param {Object} authResult Authorization result.
*/
function handleAuthResult(authResult) {
	var authButton = document.getElementById('authorizeButton');
	var filePicker = document.getElementById('filePicker');
	authButton.style.display = 'none';
	filePicker.style.display = 'none';
	if (authResult && !authResult.error) {
		// Access token has been successfully retrieved, requests can be sent to the API.
		filePicker.style.display = 'block';
		filePicker.onchange = uploadFile;
		makeApiCall();
	} else {
		// No access token could be retrieved, show the button to start the authorization flow.
		authButton.style.display = 'block';
		authButton.onclick = function() {
			gapi.auth.authorize({'client_id': getCLIENT_ID, 'scope': SCOPES, 'immediate': false}, handleAuthResult);
		};
	}
}

/**
* Called when if authResult is true.
*
* @param {Object} gapi.client.
*/
function makeApiCall(){	
	gapi.client.load('drive', 'v2', makeRequest);
}

/**
* Called when if api.client.load was successful.
*
* @param {Object} request
*/
function makeRequest(){
	var request = gapi.client.request({
        'path': '/drive/v2/files',
        'method': 'GET',
        'params': {'maxResults': '50'}
        });
    
    request.execute(function(resp) {
    	for (i=0; i<resp.items.length; i++) {
			var file = resp.items[i];
				var name = file.title;
	            var id = file.id;
           		var fileInfo = document.createElement('li');
           		//Folders dont get the ui-state-defaul class because of file imports and must have a folder icon
           		if(resp.items[i].mimeType == "application/vnd.google-apps.folder"){
           			fileInfo.className = "ui-state-selfdisabled";
           			$(fileInfo).append('<span class="t3-icon t3-icon-apps t3-icon-apps-pagetree t3-icon-pagetree-folder-default">&nbsp;</span>');
           			fileInfo.appendChild(document.createTextNode(name));
           		}else{
           			fileInfo.className = "";
           			$(fileInfo).append('<span class="t3-icon t3-icon-apps t3-icon-apps-pagetree t3-icon-pagetree-page-default">&nbsp;</span>');
           			fileInfo.appendChild(document.createTextNode(name));
	           		//Delete Link 
	            	var deleteLink = document.createElement('a');
	            	deleteLink.href = '#';
	            	deleteLink.className = "list_Link";
	           		$(deleteLink).append('<span id="'+id+'" class="t3-icon t3-icon-actions t3-icon-actions-edit t3-icon-edit-delete">&nbsp;</span>');
	           		deleteLink.onclick = function(e){
		            	deleteFile(e.srcElement.id);
		            }
	            	fileInfo.appendChild(deleteLink);
	           		//Sync Link
	            	var fileLink = document.createElement('a');
	            	fileLink.href = '#';
	            	fileLink.className = "list_Link";
	           		$(fileLink).append('<span id ="'+id+'" class="t3-icon t3-icon-actions t3-icon-actions-document t3-icon-document-save-new"></span>');
		            fileLink.onclick = function(e){
		            	printFile(e.srcElement.id, download);
		            }
		            fileInfo.appendChild(fileLink);
		            //Download Link 
		            var direktLink = document.createElement('a');
	            	direktLink.href = file.webContentLink;
	            	direktLink.id = id;
	            	direktLink.className = "list_Link";
	           		$(direktLink).append('<span class="t3-icon t3-icon-actions t3-icon-actions-document t3-icon-document-save"></span>');
	            	fileInfo.appendChild(direktLink);  		
            	}
            	// Finish 
            	document.getElementById('contentList').appendChild(fileInfo);
            	//Put the folders at the top by detach();
            	var detachCopy = $('.ui-state-selfdisabled').detach();
            	$('#contentList').prepend(detachCopy);
        }
    });
}

/**
 * Print a file's metadata.
 *
 * @param {String} fileId ID of the file to print metadata for.
 */
function printFile(fileId, callback) {
	var fileId = gapi.client.drive.files.get({
		'fileId': fileId
	});
	fileId.execute(function(resp) {
		downloadFile(resp, callback);
	});
}

/**
 * Download a file's content.
 *
 * @param {File} file Drive File instance.
 * @param {Function} callback Function to call when the request is complete.
 */
function downloadFile(file, callback) {
	if (file.downloadUrl) {
	    var accessToken = gapi.auth.getToken().access_token;
	    var fileName = file.title;
	    var xhr = new XMLHttpRequest();
	    xhr.open('GET', file.downloadUrl);
	    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
	    xhr.onload = function() {
			callback(xhr.responseText, fileName);
	    };
	    xhr.onerror = function() {
			TYPO3.Flashmessage.display(
				TYPO3.Severity.error,
				'Synchronisation error!',
				'Please check file size.',
				3
			);
	    };
	    xhr.send();
	} else {
		callback(null);
	}
}

/**
 * Load file in POST[file]
 *
 * @param {data} file Drive File instance.
 * @param {success} callback Function to call when the request is complete.
 */
function download(data, downloadFileName) {
	$.ajax({
		url: 'ajax.php',
		type: 'POST',
		dataType: 'json',
		cache: false,
        async: true,
            
		data: {
			ajaxID: 'tx_gdrivefilebrowser::AjaxRequest',
			file: data,
			fileName: downloadFileName
		},      
		success: function(e) {
			TYPO3.Flashmessage.display(
				TYPO3.Severity.ok,
				'Synchronisation complete! ',
				'Path: fileadmin/user_upload/gdrivefilebrowser/'+downloadFileName,
				5
			);
		},
		error: function(e) {
			TYPO3.Flashmessage.display(
				TYPO3.Severity.error,
				'Synchronisation error!',
				'Please check file size.',
				3
			);               
		}
	});
}

/**
* Start the file upload.
*
* @param {Object} evt Arguments from the file selector.
*/
function uploadFile(evt) {
	gapi.client.load('drive', 'v2', function() {
		var file = evt.target.files[0];
		insertFile(file);
	});
}

/**
* Insert new file.
*
* @param {File} fileData File object to read data from.
* @param {Function} callback Function to call when the request is complete.
*/
function insertFile(fileData, callback) {
	const boundary = '-------314159265358979323846';
	const delimiter = "\r\n--" + boundary + "\r\n";
	const close_delim = "\r\n--" + boundary + "--";

	var reader = new FileReader();
		reader.readAsBinaryString(fileData);
		reader.onload = function(e) {
			var contentType = fileData.type || 'application/octet-stream';
			var metadata = {
				'title': fileData.name,
				'mimeType': contentType
		};

	var base64Data = btoa(reader.result);
	var multipartRequestBody =
		delimiter +
		'Content-Type: application/json\r\n\r\n' +
		JSON.stringify(metadata) +
		delimiter +
		'Content-Type: ' + contentType + '\r\n' +
		'Content-Transfer-Encoding: base64\r\n' +
		'\r\n' +
		base64Data +
		close_delim;

	var request = gapi.client.request({
			'path': '/upload/drive/v2/files',
			'method': 'POST',
			'params': {'uploadType': 'multipart'},
			'headers': {
				'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
			},
			'body': multipartRequestBody});
			if (!callback) {
				callback = function(file) {
					TYPO3.Flashmessage.display(
						TYPO3.Severity.ok,
						'Upload to Google Drive complete! ',
						'File '+file.title+' was uploaded to Google Drive by a Size of '+file.fileSize+' Bytes.',
						5
					);
					$('li').remove();
			makeRequest();
			};
		}
		request.execute(callback);
	}
}

/**
 * Permanently delete a file, skipping the trash.
 *
 * @param {String} fileId ID of the file to delete.
 */
function deleteFile(fileId) {
	var request = gapi.client.drive.files.delete({
		'fileId': fileId
	});
	request.execute(function(resp) {
		refreshList(); 
		TYPO3.Flashmessage.display(
			TYPO3.Severity.warning,
			'File has been deleted!',
			'Delete complete.',
			3
		);
	});
}

/**
 * Create new Folders in Drive root directory.
 *
 * @param {String} folderName of the new folder.
 */
function createFolder(folderName) {
	var request = gapi.client.request({
		'path': 'drive/v2/files',
		'method': 'POST',
		'body': {
		'title': folderName,
		'mimeType': 'application/vnd.google-apps.folder'
	}
	});
	request.execute(function(resp) {
		refreshList(); 
		TYPO3.Flashmessage.display(
			TYPO3.Severity.ok,
			'Folder has been created!',
			'Transfer complete.',
			3
		);
	});
}

/**
 * Refresh lisl view
 */
function refreshList() {
	$('#contentList li').remove();
	makeApiCall();
}

/**
* JqueryUI document ready function.
*/
$(document).ready(function() {
	$(".sortable").sortable({
		items: "li:not(.ui-state-selfdisabled)",
		placeholder: "ui-state-highlight"
	});
	$(".sortable").disableSelection();
	$('.list_refresh').bind('click', refreshList);
	$('#createFolderLink').bind('click', function(){
		$("#dialog-form").dialog({
			autoopen: true,
	        modal: true,
	        buttons: {
	            "Ok": function() {
	                createFolder($("#inputfoldertxt").val())
	                $(this).dialog("close");
	            },
	            "Cancel": function() {
	                $(this).dialog("close");
	            }
	        }
		});
	});
	$.each($('.tx_gdrivefilebrowser tr'), function(index){
		$('.activate_'+index).bind('click', function() {
			$(this).find('span').toggleClass('activate_hide');
			$(this).parent().parent().siblings().find('.t3-icon-edit-unhide').removeClass('activate_hide');
			$(this).parent().parent().siblings().find('.t3-icon-edit-add').addClass('activate_hide');
			$('#contentList li').remove();
			checkAuth(index);
		});
	});
})	
