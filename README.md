gdrivefilebrowser
=================

Google Drive File Browser Extension by TYPO3 v6.x

KEY:             	gdrivefilebrowser

Module Name:         Major Project					
Module Number:       SAE 620						
Block:               Major Project					
Date Submitted:      13.11.2013						
Institution:         SAE Institute Vienna
Award Name:          Bachelor of Science (Honors), Web Development

Year:                2012/2013
Name:                David Steindl
City:                Vienna							
Country:             Austria

================
Extension Functions 
================
This is Javascript based Filebrowser Extension for TYPO3 Version 6.x.
The Ajax Requests are redirected to a File Abstraction Layer Controller.
The Data is transferred by a PHP $_POST variable so it is important to maximize 
the upload size in your Server php.ini. Check this [Link](http://wiki.typo3.org/How_to_upload_big_files "Link.")

Funktions:
- Save files from Google Drive to fileadmin/user_upload/gdrivefilebrowser folder.
- Download file direct.
- Upload files.
- Create folders.

================
Install Instructions Google Settings
================

- Registration Link Google API Console -> [Link](http://code.google.com/apis/console "Google API Console")
- Create a project and activate services -> Drive API
- Create a OAuth2.0 Client
- Create a Client ID for web applications and get a Client ID
- Set the Redirect URIs to your Backend URL -> http://xxxx.xx/typo3/backend.php
- Set the JavaScript origins to your URL -> http://xxxx.xx/
- Now your Google Drive Account supports all features of the Javascript API

================
Install Instructions TYPO3 CMS
================

- Install the current TYPO3 Version 6.x: Installguide -> [Link](http://docs.typo3.org/typo3cms/InstallationGuide/Index.html#start "TYPO3 Installguide")
- Install and activate the application at the Extension Manager
- Now you are ready to start the Application and paste in your Google Client ID
- Finish and have fun 

================
Extension Screenshot
================

![alt text](/screenshot/screenshot.png "Screenshot")