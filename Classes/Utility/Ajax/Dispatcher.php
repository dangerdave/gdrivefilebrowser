<?php
class Dispatcher {

	/**
	* AjaxReq init function.
	*
	* @param string $response
	* @param  \TYPO3\CMS\Core\Resource\StorageRepository $storageRepository
	* @return true
	*/
	public function AjaxReq() {
		if($_POST['file']){
			$response = $_POST['file'];
			$filename = $_POST['fileName'];
			$storageRepository = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance('TYPO3\CMS\Core\Resource\StorageRepository');
			$storage = $storageRepository->findByUid(1);
			$user_upload_folder = $storage->getFolder('user_upload');
			$folder_exist = $user_upload_folder->hasFolder('gdrivefilebrowser');
			if(!$folder_exist){
				$this->createFolders('gdrivefilebrowser', $user_upload_folder, $storage);
			}
			$this->createFiles($response, $storage, $filename);
		}
	}
	
	
	/**
	* Creates a file.
	*
	* @param string $data
	* @param  \TYPO3\CMS\Core\Resource\StorageRepository $storage
	* @return \TYPO3\CMS\Core\Resource\Folder The new (created) folder object
	*/
	public function createFiles($data, $storage, $filename) {
		$fileObject = $storage->createFile($filename, $storage->getDefaultFolder()); 
		$storage->setFileContents($fileObject, $data);
		$this->moveFile($fileObject, $storage, $filename);
	}
	
	
	/**
	* Move a file.
	*
	* @param string $data
	* @param  \TYPO3\CMS\Core\Resource\StorageRepository $storage
	* @return \TYPO3\CMS\Core\Resource\Folder The new (created) folder object
	*/
	public function moveFile($file, $storage, $filename) {
		$gdrive_upload_folder = $storage->getFolder('user_upload/gdrivefilebrowser');
		$storage->moveFile($file, $gdrive_upload_folder, $filename);
	}
	
	
	/**
	* Creates a folder.
	*
	* @param string $newFolderName
	* @param \TYPO3\CMS\Core\Resource\Folder $parentFolder
	* @return \TYPO3\CMS\Core\Resource\Folder The new (created) folder object
	*/
	public function createFolders($newFolderName, \TYPO3\CMS\Core\Resource\Folder $parentFolder, $storage) {
		$gdrive_upload_folder = $storage->createFolder($newFolderName, $parentFolder);	
	}
	

}

?>