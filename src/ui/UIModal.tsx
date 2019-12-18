/**
 * The components of this file wrap the bootstrap modal component.
 * See the bootstrap documentation for more informations: https://getbootstrap.com/docs/4.0/components/modal/
 */

import * as React from "react";


/**
 * Use this Component with the [[ModalHeader]], [[ModalBody]] and [[ModalFooter]] Component as Children.
 * @param props.text The text inside the button
 * @param props.tag The unique id of the modal
 * @param props.className Bootstrap class names to customise the button
 */
export function Modal(props) {
    let tag = props.tag;
    let hashtag = "#" + tag;
    const style = {
      margin: '10px 0px'
    };
    return (<div>
        <button disabled={props.disabled} type="button" style={style} className={props.className} data-toggle="modal" data-target={hashtag}>
            {props.text}
        </button>
        <div className="modal fade" id={tag} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
                {props.children}
            </div>
          </div>
        </div>
    </div>);
}

/**
 * Use this Component inside the [[Modal]] component
 * @param props.title The title of the modal
 */
export function ModalHeader(props) {
    return (<div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">{props.title}</h5>
              {props.children}
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>);
}

/**
 * Use this Component inside the [[Modal]] component
 */
export function ModalBody(props) {
    return (<div className="modal-body">
        {props.children}
      </div>);
}

/**
 * Use this Component inside the [[Modal]] component
 */
export function ModalFooter(props) {
    return (<div className="modal-footer">
        {props.children}
      </div>);
}
