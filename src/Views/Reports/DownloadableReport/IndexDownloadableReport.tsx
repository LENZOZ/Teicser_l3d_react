import React, { useState, useEffect } from 'react';
import { Col, Tooltip, Row, OverlayTrigger } from 'react-bootstrap';
import { BaseContentView } from '../../Common/BaseContentView';
import { useFullIntl } from '../../../Common/Hooks/useFullIntl';
import { $u, $j, $d } from '../../../Common/Utils/Reimports';
import { ApiTable } from '../../../Components/Api/ApiTable';
import { LocalizedColumnsCallback } from '../../../Common/Utils/LocalizedColumnsCallback';
import { useApi } from "../../../Common/Hooks/useApi";
import { useDashboard } from '../../../Common/Hooks/useDashboard';
import { useToasts } from 'react-toast-notifications';

export interface reportePdf {
    fecha: string;
    pdf_name: string;
}

const inicialreportePdf = {
	fecha: "",
	pdf_name: "",
}

const PdfColumns : LocalizedColumnsCallback<reportePdf> = () => [
	{ name: 'Fecha', selector: pdf => pdf.fecha},
	{ name: 'Nombre', selector: pdf => pdf.pdf_name}
];

export const IndexDownloadableReport = () => {
	const [reportePdf, setPeportePdf] = useState<reportePdf>(inicialreportePdf);
	const { capitalize: caps, intl } = useFullIntl();
	const { setLoading } = useDashboard();
	const api = useApi();
	const { addToast } = useToasts();


	const pdfDescargar = (pdf : any) => {
		setLoading(true);
		api.get< string | Blob | File>($j('descargar_pdf', pdf.ruta.toString()), { responseType: 'blob' }).success(e => {
		  $d(e, pdf.pdf_name);
		  setLoading(false);
		  addToast(caps('success:base.success'), {
					appearance: 'success',
					autoDismiss: true,
				});
			}).fail('base.post');
	}

	const colums = PdfColumns(intl)

	colums.push({  
		name: 'Opción', 
		center: true,
		width: '90px',
		cell: pdf => (
			<>
			<Col sm={6}>
				<OverlayTrigger
						placement="top"
						overlay={
							<Tooltip id={`tooltip-1`}>
								descargar
							</Tooltip>
						}
						>
						<i className='fas fas fa-file-pdf' style={{ cursor: 'pointer', color: '#09922C' }} onClick={() => pdfDescargar(pdf)}/> 
				</OverlayTrigger>
			</Col>
			</>
		)
	});


	return (
		<>
		<BaseContentView title='titles:reports_pdf'>
			<Col sm={12}>
				<ApiTable<reportePdf>
					columns={colums}
					source={"index_pdf"} 
				/>
			</Col>
		</BaseContentView>
		</>
	);
};