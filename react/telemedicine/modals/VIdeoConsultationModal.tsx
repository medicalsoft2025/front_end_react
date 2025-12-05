import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useSocket } from '../hooks/useSocket';
import { VideoConsultaModalProps } from '../interfaces/VideoConsultationTypes';



export const VIdeoConsultationModal: React.FC<VideoConsultaModalProps> = ({ visible, onHide, cita }) => {
    const [roomId, setRoomId] = useState('');
    const [roomLink, setRoomLink] = useState('');
    const socket = useSocket();

    useEffect(() => {
        if (visible && socket) {
            // Configurar eventos de socket
            socket.on('room-created', (newRoomId: string) => {
                setRoomId(newRoomId);
                setRoomLink(`${window.location.origin}/video-llamada?roomId=${newRoomId}`);
            });
        }

        return () => {
            if (socket) {
                socket.off('room-created');
            }
        };
    }, [visible, socket]);

    const crearSala = () => {
        if (socket) {
            socket.emit('create-room', 'doctor');
        }
    };

    const copiarEnlace = () => {
        navigator.clipboard.writeText(roomLink)
            .then(() => {
                // Mostrar notificación de éxito
            })
            .catch(err => console.error('Error al copiar:', err));
    };

    const footerContent = (
        <div>
            <Button label="Aceptar" icon="pi pi-check" onClick={onHide} />
            <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
        </div>
    );

    return (
        <Dialog
            header="Video consulta"
            visible={visible}
            style={{ width: '50vw' }}
            footer={footerContent}
            onHide={onHide}
        >
            <Card>
                <div className="grid">
                    <div className="col-6">
                        <p><strong>Código de sala:</strong></p>
                        <p className={roomId ? 'text-primary' : ''}>
                            {roomId || 'CFHFG65H5GF4H8...'}
                        </p>

                        <p><strong>Apertura:</strong></p>
                        <p>{new Date().toLocaleString()}</p>
                    </div>
                    <div className="col-6">
                        <p><strong>Estado:</strong></p>
                        <p className="text-success">Abierta</p>
                    </div>
                </div>

                <p className="text-sm text-color-secondary mt-3">
                    "Esta información junto con el enlace para ingresar a la sala fue enviada por correo
                    electrónico a <strong>user@test.com</strong> y por WhatsApp a <strong>96385214</strong>"
                </p>

                <div className="grid mt-4">
                    <div className="col-6">
                        <Button
                            icon="pi pi-sign-in"
                            label="Entrar"
                            className="p-button-outlined p-button-primary w-full"
                            onClick={crearSala}
                        />
                    </div>
                    <div className="col-6">
                        <Button
                            icon="pi pi-times"
                            label="Finalizar"
                            className="p-button-outlined p-button-danger w-full"
                        />
                    </div>
                    <div className="col-12 mt-2">
                        <Button
                            icon="pi pi-link"
                            label="Copiar enlace de invitación"
                            className="p-button-outlined p-button-info w-full"
                            onClick={copiarEnlace}
                            disabled={!roomId}
                        />
                    </div>
                </div>

                {roomLink && (
                    <div className="mt-3 text-center">
                        <small>Enlace: {roomLink}</small>
                    </div>
                )}
            </Card>
        </Dialog>
    );
};

