<?php
namespace TYPO3\Gdrivefilebrowser\Controller;

/***************************************************************
 *  Copyright notice
 *
 *  (c) 2013 David Steindl <david.steindl@gmx.de>
 *  
 *  All rights reserved
 *
 *  This script is part of the TYPO3 project. The TYPO3 project is
 *  free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  The GNU General Public License can be found at
 *  http://www.gnu.org/copyleft/gpl.html.
 *
 *  This script is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  This copyright notice MUST APPEAR in all copies of the script!
 ***************************************************************/

/**
 *
 *
 * @package gdrivefilebrowser
 * @license http://www.gnu.org/licenses/gpl.html GNU General Public License, version 3 or later
 *
 */
class GdrivefilebrowserController extends \TYPO3\CMS\Extbase\Mvc\Controller\ActionController {

	/**
	 * gdrivefilebrowserRepository
	 *
	 * @var \TYPO3\Gdrivefilebrowser\Domain\Repository\GdrivefilebrowserRepository
	 * @inject
	 */
	protected $gdrivefilebrowserRepository;
	
	/**
	 * action list
	 *
	 * @return void
	 */
	public function listAction() {
		$gdrivefilebrowsers = $this->gdrivefilebrowserRepository->findAll();
		$this->view->assign('gdrivefilebrowsers', $gdrivefilebrowsers);
	}

	/**
	 * action show
	 *
	 * @param \TYPO3\Gdrivefilebrowser\Domain\Model\Gdrivefilebrowser $gdrivefilebrowser
	 * @return void
	 */
	public function showAction(\TYPO3\Gdrivefilebrowser\Domain\Model\Gdrivefilebrowser $gdrivefilebrowser) {
		$this->view->assign('gdrivefilebrowser', $gdrivefilebrowser);
	}

	/**
	 * action new
	 *
	 * @param \TYPO3\Gdrivefilebrowser\Domain\Model\Gdrivefilebrowser $newGdrivefilebrowser
	 * @dontvalidate $newGdrivefilebrowser
	 * @return void
	 */
	public function newAction(\TYPO3\Gdrivefilebrowser\Domain\Model\Gdrivefilebrowser $newGdrivefilebrowser = NULL) {
		$this->view->assign('newGdrivefilebrowser', $newGdrivefilebrowser);
	}

	/**
	 * action create
	 *
	 * @param \TYPO3\Gdrivefilebrowser\Domain\Model\Gdrivefilebrowser $newGdrivefilebrowser
	 * @return void
	 */
	public function createAction(\TYPO3\Gdrivefilebrowser\Domain\Model\Gdrivefilebrowser $newGdrivefilebrowser) {
		$this->gdrivefilebrowserRepository->add($newGdrivefilebrowser);
		$this->flashMessageContainer->add('Your new Gdrivefilebrowser was created.');
		$this->redirect('list');
	}

	/**
	 * action edit
	 *
	 * @param \TYPO3\Gdrivefilebrowser\Domain\Model\Gdrivefilebrowser $gdrivefilebrowser
	 * @return void
	 */
	public function editAction(\TYPO3\Gdrivefilebrowser\Domain\Model\Gdrivefilebrowser $gdrivefilebrowser) {
		$this->view->assign('gdrivefilebrowser', $gdrivefilebrowser);
	}

	/**
	 * action update
	 *
	 * @param \TYPO3\Gdrivefilebrowser\Domain\Model\Gdrivefilebrowser $gdrivefilebrowser
	 * @return void
	 */
	public function updateAction(\TYPO3\Gdrivefilebrowser\Domain\Model\Gdrivefilebrowser $gdrivefilebrowser) {
		$this->gdrivefilebrowserRepository->update($gdrivefilebrowser);
		$this->flashMessageContainer->add('Your Gdrivefilebrowser was updated.');
		$this->redirect('list');
	}

	/**
	 * action delete
	 *
	 * @param \TYPO3\Gdrivefilebrowser\Domain\Model\Gdrivefilebrowser $gdrivefilebrowser
	 * @return void
	 */
	public function deleteAction(\TYPO3\Gdrivefilebrowser\Domain\Model\Gdrivefilebrowser $gdrivefilebrowser) {
		$this->gdrivefilebrowserRepository->remove($gdrivefilebrowser);
		$this->flashMessageContainer->add('Your Gdrivefilebrowser was removed.');
		$this->redirect('list');
	}
	


}
?>