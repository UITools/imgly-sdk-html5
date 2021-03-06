"use strict";
/*!
 * Copyright (c) 2013-2015 9elements GmbH
 *
 * Released under Attribution-NonCommercial 3.0 Unported
 * http://creativecommons.org/licenses/by-nc/3.0/
 *
 * For commercial use, please contact us at contact@9elements.com
 */

import EventEmitter from "../../../lib/event-emitter";

class FileLoader extends EventEmitter {
  constructor (kit, ui) {
    super();

    this._kit = kit;
    this._ui = ui;

    // http://stackoverflow.com/questions/7110353/html5-dragleave-fired-when-hovering-a-child-element
    this._dragCounter = 0;

    this._container = this._ui.container.querySelector('.imglykit-drop-area-container');

    this._onDropAreaDragEnter = this._onDropAreaDragEnter.bind(this);
    this._onDropAreaDragOver = this._onDropAreaDragOver.bind(this);
    this._onDropAreaDragLeave = this._onDropAreaDragLeave.bind(this);
    this._onDropAreaDrop = this._onDropAreaDrop.bind(this);
    this._onDropAreaClick = this._onDropAreaClick.bind(this);
    this._onFileInputChange = this._onFileInputChange.bind(this);

    this._hiddenInputField = this._ui.container.querySelector(".imglykit-drop-area .imglykit-drop-area-hidden-input");
    this._hiddenInputField.addEventListener("change", this._onFileInputChange);

    this._handleDropArea();
  }

  /**
   * Opens the file dialog
   */
  openFileDialog () {
    this._hiddenInputField.click();
  }

  /**
   * Finds the drop area, adds event listeners
   * @private
   */
  _handleDropArea () {
    let { container } = this._ui;

    this._dropArea = container.querySelector(".imglykit-drop-area");
    this._dropArea.addEventListener("dragenter", this._onDropAreaDragEnter);
    this._dropArea.addEventListener("dragover", this._onDropAreaDragOver);
    this._dropArea.addEventListener("dragleave", this._onDropAreaDragLeave);
    this._dropArea.addEventListener("drop", this._onDropAreaDrop);
    this._dropArea.addEventListener("dragdrop", this._onDropAreaDrop);
    this._dropArea.addEventListener("click", this._onDropAreaClick);
  }

  /**
   * Gets called when the user clicks on the drop area. Opens the file
   * dialog by triggering a click on the hidden input field
   * @param {Event} e
   * @private
   */
  _onDropAreaClick () {
    this.openFileDialog();
  }

  /**
   * Gets called when the user drags a file over the drop area
   * @param {Event} e
   * @private
   */
  _onDropAreaDragEnter (e) {
    e.preventDefault();

    this._dragCounter++;
    this._dropArea.classList.add("imglykit-drop-area-active");
  }

  /**
   * We need to cancel this event to get a drop event
   * @param {Event} e
   * @private
   */
  _onDropAreaDragOver (e) {
    e.preventDefault();
  }

  /**
   * Gets called when the user does no longer drag a file over the drop area
   * @param {Event} e
   * @private
   */
  _onDropAreaDragLeave (e) {
    e.preventDefault();

    this._dragCounter--;

    if (this._dragCounter === 0) {
      this._dropArea.classList.remove("imglykit-drop-area-active");
    }
  }

  /**
   * Gets called when the user drops a file on the drop area
   * @param {Event} e
   * @private
   */
  _onDropAreaDrop (e) {
    e.stopPropagation();
    e.preventDefault();
    e.returnValue = false;

    this._dropArea.classList.remove("imglykit-drop-area-active");

    if (!e.dataTransfer) return;

    this._handleFile(e.dataTransfer.files[0]);
  }

  /**
   * Gets called when the user selected a file
   * @param {Event} e
   * @private
   */
  _onFileInputChange () {
    this._handleFile(this._hiddenInputField.files[0]);
  }

  /**
   * Gets called when the user selected a file. Emits a `file` event.
   * @param {File} file
   * @private
   */
  _handleFile (file) {
    this.emit("file", file);
  }

  /**
   * Removes event listeners and removes the container form the dom
   */
  removeDOM () {
    this._dropArea.removeEventListener("dragenter", this._onDropAreaDragEnter);
    this._dropArea.removeEventListener("dragover", this._onDropAreaDragOver);
    this._dropArea.removeEventListener("dragleave", this._onDropAreaDragLeave);
    this._dropArea.removeEventListener("drop", this._onDropAreaDrop);
    this._dropArea.removeEventListener("dragdrop", this._onDropAreaDrop);
    this._dropArea.removeEventListener("click", this._onDropAreaClick);

    if (this._container.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
  }
}

export default FileLoader;
