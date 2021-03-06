import React, { Component } from "react";
import { IoClose } from "react-icons/io5";

class SetListPopup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cooldown: true, //Stops immediate outside click call
        };

        // Creates reference for click detection
        setTimeout(() => {
            this.state.cooldown = false;
        }, 10);

        this.setBoxRef = (elem) => {
            //A callback ref is used to avoid ref.current being undefined
            this.box = elem;
        };
    }

    componentDidMount() {
        document.addEventListener("click", this.checkOutsideClick);
    }

    checkOutsideClick = (e) => {
        //Is called every click. Checks if click is in or outside of box
        if (this.box && !this.box.contains(e.target) && !this.state.cooldown) {
            this.props.popupControl(this.props.index, false);
        }
    };

    render() {
        return (
            <div className="micro-popup" ref={this.setBoxRef}>
                {/* <div className="micro-popup-edit"><IoPencil className="micro-popup-icon"/>Edit Set</div> */}
                <div
                    className="micro-popup-delete"
                    onClick={this.props.deleteSet}
                >
                    <IoClose className="micro-popup-icon" />
                    Delete Set
                </div>
            </div>
        );
    }
}

export default SetListPopup;
