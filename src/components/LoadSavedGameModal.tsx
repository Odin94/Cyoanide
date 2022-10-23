import { Link } from "gatsby";
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { getGameName, getLevelState, resetSaveState } from '../SaveState';


export function LoadSavedGameModal() {
    const savedGameName = getGameName()

    const [show, setShow] = useState(!!savedGameName)

    const deleteSave = () => {
        resetSaveState()
        setShow(false)
    }

    return (
        <>
            <Modal
                show={show}
                onHide={deleteSave}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header className="heading">
                    <Modal.Title>Saved game detected: <br />"{savedGameName}"</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    You can load the saved game and continue playing or delete your save and start a new game.
                </Modal.Body>
                <Modal.Footer>
                    <Button style={{ marginRight: "auto" }} variant="danger" onClick={deleteSave}>
                        Delete Save
                    </Button>
                    <Link to={`/game/${getLevelState().at(-1) ?? ""}`}><Button variant="success">
                        Load Game
                    </Button></Link>
                </Modal.Footer>
            </Modal>
        </>
    )
}