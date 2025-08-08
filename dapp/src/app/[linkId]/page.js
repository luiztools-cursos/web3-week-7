"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getLink, payLink } from "@/services/Web3Service";

export default function Home() {

    const [message, setMessage] = useState("");
    const [link, setLink] = useState({ fee: "0" });

    const params = useParams();

    useEffect(() => {
        setMessage("Buscando dados do link...aguarde...");
        getLink(params.linkId)
            .then(link => {
                setMessage("");
                if (link.url)
                    window.location.href = link.url;
                else
                    setLink(link);
            })
            .catch(err => setMessage(err.message));
    }, [])

    function btnAccessClick() {
        setMessage("Pagando pelo acesso...aguarde...");
        payLink(params.linkId, link.fee)
            .then(() => {
                setMessage("Pagamento realizado...redirecionando...");
                return getLink(params.linkId)
            })
            .then(link => window.location.href = link.url)
            .catch(err => setMessage(err.message));
    }

    return (
        <div className="container px-4 py-5">
            <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
                <div className="col-6">
                    <img src="https://images.unsplash.com/photo-1541543975512-86aad5d2cf93?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="d-block mx-lg-auto img-fluid" width="700" />
                </div>
                <div className="col-6">
                    <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">Link Protegido</h1>
                    <p className="lead">Este link está protegido pela LinkShield.</p>
                    <hr />
                    <p>Para acessar o conteúdo original, conecte sua carteira abaixo e confirme o pagamento da taxa de <strong>{link.fee} wei</strong>.</p>
                    <div className="row mb-3">
                        <div className="col-6">
                            <button type="button" className="btn btn-primary w-100 h-100" onClick={btnAccessClick}>
                                <img src="/metamask.svg" width={32} className="me-2" />
                                Pagar e Acessar Link
                            </button>
                        </div>
                    </div>
                    {
                        message
                            ? <div className="alert alert-success p-3 col-12 mt-3" role="alert">{message}</div>
                            : <></>
                    }
                </div>
            </div>
        </div>
    );
}
