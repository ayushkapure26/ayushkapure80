import React,{useState,useEffect} from 'react';
import QRCode from 'qrcode';
import {X,Download} from 'lucide-react';
import useModal from '../utils/useModal';
export default function TokenPassModal({booking,onClose,onGoToTracker}){
 const[qr,setQr]=useState('');const modal=useModal(onClose);
 useEffect(()=>{let live=true;if(booking)QRCode.toDataURL(booking.id,{width:240,margin:2}).then(v=>{if(live)setQr(v);}).catch(()=>{});return()=>{live=false;}},[booking?.id]);
 if(!booking)return null;
 const current=['Active','In Progress'].includes(booking.status);
 return <div className="modal-overlay"><div ref={modal} className="modal-content pass-modal" role="dialog" aria-modal="true" aria-labelledby="pass-title"><button className="modal-close" aria-label="Close pass" onClick={onClose}><X/></button><span className="badge badge-primary">{booking.status}</span><h2 id="pass-title">CNG refill pass</h2><div className="token-number">{booking.tokenNo}</div><h3>{booking.stationName}</h3><p>{booking.vehicleNo}</p>{current?<>{qr?<img className="qr-image" src={qr} alt={`QR for token ${booking.tokenNo}`}/>:<p>Use the token number at the station.</p>}<p>Show this pass to the station operator.</p></>:<p>This pass is {booking.status.toLowerCase()} and cannot be used for refilling.</p>}<dl className="pass-details"><dt>Arrival</dt><dd>{new Date(booking.scheduledAt).toLocaleString()}</dd><dt>Refill</dt><dd>{booking.refillQty}</dd><dt>Driver</dt><dd>{booking.driverName}</dd><dt>Queue position</dt><dd>{current?booking.positionInQueue:'—'}</dd></dl><div className="button-row"><button className="btn btn-primary" onClick={onGoToTracker}>My bookings</button>{current&&qr&&<a className="btn btn-secondary" href={qr} download={`${booking.tokenNo}.png`}><Download size={16}/>Save QR</a>}</div></div></div>;
}
