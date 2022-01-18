import React, { Component } from "react";
import { IoEllipsisVertical, IoAddCircle } from "react-icons/io5";
import axios from "axios";
import SetListPopup from "./set_list_popup";
import CreateSet from "./create_set";
import DeleteSet from "./delete_set";
import Popup from "../popup";
import * as dayjs from "dayjs";

import { Link } from "react-router-dom";
// Set Dropdown

const maxItemLen = 25;

const base_path = "/app/tutor/sets";

class SetList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sets: [],
            createSetPopupOpen: false,
            deleteSetPopupOpen: false,
            deleteSet: undefined,
        };
        this.loadSets();
    }

    loadSets = () => {
        axios
            .get("/api/tutors/sets/")
            .then((res) => {
                const tempSets = res.data.sets.map((set) => {
                    set.dateF = dayjs(set.date).format("MMM. D, YYYY");
                    return { ...set, popupOpen: false };
                });
                this.setState({ sets: tempSets });
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    window.location.replace("/login");
                }
            });
    };

    openPopup = () => {
        this.props.popupMethod(true, 0, { loadSets: this.loadSets });
    };

    controlSetPopup = (index, bool) => {
        const tempSets = this.state.sets;
        tempSets[index].popupOpen = bool;
        this.setState({
            sets: tempSets,
        });
    };

    controlCreateSetPopup = (bool) => {
        this.setState({ createSetPopupOpen: bool });
    };
    controlDeleteSetPopup = (bool) => {
        this.setState({ deleteSetPopupOpen: bool });
    };

    deleteSet = (set) => {
        this.setState({ deleteSet: set });
        this.controlDeleteSetPopup(true);
    };

    truncate = (text, length) => {
        if (text.length < length) {
            return text;
        } else {
            return text.slice(0, length).trim() + "...";
        }
    };

    render() {
        return (
            <div className="set-list-outer">
                <div className="set-list-header-cont">
                    <h2>Sets</h2>
                    <IoAddCircle
                        className="set-list-header-plus"
                        onClick={() => this.controlCreateSetPopup(true)}
                    />
                </div>
                {!this.state.sets.length ? (
                    <div className="no-sets-outer">
                        <span>
                            You don't have any sets{" "}
                            <a
                                className="primary-a"
                                onClick={() => this.controlCreateSetPopup(true)}
                            >
                                make one?
                            </a>
                        </span>
                    </div>
                ) : (
                    <div className="set-list-inner">
                        {this.state.sets.map((set, index) => (
                            <div
                                key={set.id}
                                className="set-list-item"
                                index={index}
                            >
                                <Link
                                    to={`${base_path}/${set.id}`}
                                    className="set-list-item-content"
                                >
                                    <h3 className="set-list-item-title">
                                        {this.truncate(set.title, maxItemLen)}
                                    </h3>
                                    <em className="set-list-item-date">
                                        {set.dateF}
                                    </em>
                                </Link>
                                <div className="set-list-item-controls">
                                    {set.popupOpen && (
                                        <SetListPopup
                                            popupControl={this.controlSetPopup}
                                            index={index}
                                            deleteSet={() =>
                                                this.deleteSet({
                                                    title: set.title,
                                                    id: set.id,
                                                })
                                            }
                                        />
                                    )}
                                    <IoEllipsisVertical
                                        className="control-icon"
                                        onClick={() =>
                                            this.controlSetPopup(index, true)
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {this.state.createSetPopupOpen && (
                    <Popup popupMethod={this.controlCreateSetPopup}>
                        <CreateSet
                            popupMethod={this.controlCreateSetPopup}
                            loadSets={this.loadSets}
                        />
                    </Popup>
                )}
                {this.state.deleteSetPopupOpen && (
                    <Popup popupMethod={this.controlDeleteSetPopup}>
                        <DeleteSet
                            popupMethod={this.controlDeleteSetPopup}
                            loadSets={this.loadSets}
                            set={this.state.deleteSet}
                        />
                    </Popup>
                )}
            </div>
        );
    }
}

export default SetList;
