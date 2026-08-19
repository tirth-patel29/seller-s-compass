import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Order, ExportOrder, Product } from '@/lib/types';
import { currencyService } from './currencyService';
import { inr } from '@/lib/format';

export const documentService = {
  generateExportPackagePdf(order: Order, exportOrder: ExportOrder, product: Product) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 14;
    
    // Header
    doc.setFillColor(30, 41, 59); // slate-800
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('DAK GHAR NIRYAT KENDRA', margin, 20);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Export Document Package', margin, 30);
    
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(10);
    doc.text('Prototype Export Document', pageWidth - margin - 50, 30);
    
    let yPos = 50;

    // Disclaimer
    doc.setTextColor(180, 83, 9); // amber-700
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text('This document package is generated for prototype/demo purposes and is not an official government-issued customs document.', margin, yPos);
    
    yPos += 15;
    
    // Order Header
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Order Details', margin, yPos);
    yPos += 8;

    autoTable(doc, {
      startY: yPos,
      theme: 'grid',
      headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold' },
      bodyStyles: { textColor: [51, 65, 85] },
      margin: { left: margin },
      body: [
        ['Order ID', order.id],
        ['Order Date', new Date(order.createdAt).toLocaleDateString()],
        ['Seller', 'Meena Handicrafts'],
        ['Buyer', order.buyerName],
        ['Destination', order.destinationCountry],
        ['DNK', exportOrder.status === 'submitted' ? exportOrder.dnk : 'Pending / Not Yet Submitted'],
        ['Document Status', 'Generated']
      ],
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Commercial Invoice
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Commercial Invoice — Prototype', margin, yPos);
    yPos += 8;

    autoTable(doc, {
      startY: yPos,
      theme: 'grid',
      headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold' },
      bodyStyles: { textColor: [51, 65, 85] },
      margin: { left: margin },
      body: [
        ['Product', product.name],
        ['Quantity', order.quantity.toString()],
        ['Country of Origin', 'India'],
        ['Product Value', inr(order.sellerAmount)],
        ['Estimated India Post international postage', inr(order.shippingAmount)],
        ['Estimated Import Duty', inr(order.dutyAmount)],
        ['Platform Fee', inr(order.platformFee)],
        ['Order Total', inr(order.total)]
      ],
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Package Details
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Package Details — Prototype', margin, yPos);
    yPos += 8;

    autoTable(doc, {
      startY: yPos,
      theme: 'grid',
      headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold' },
      bodyStyles: { textColor: [51, 65, 85] },
      margin: { left: margin },
      body: [
        ['Weight', `${exportOrder.packageInfo?.weight || 'Not provided'} kg`],
        ['Length', `${exportOrder.packageInfo?.length || 'Not provided'} cm`],
        ['Width', `${exportOrder.packageInfo?.width || 'Not provided'} cm`],
        ['Height', `${exportOrder.packageInfo?.height || 'Not provided'} cm`],
        ['Declared Value', inr(Number(exportOrder.exportInfo?.declaredValue) || order.sellerAmount)],
        ['Package Type', 'Standard Box']
      ],
    });

    // Add new page for next sections if running out of space
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    } else {
      yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // Export Declaration
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('3. Export Declaration — Prototype', margin, yPos);
    yPos += 8;

    autoTable(doc, {
      startY: yPos,
      theme: 'grid',
      headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold' },
      bodyStyles: { textColor: [51, 65, 85] },
      margin: { left: margin },
      body: [
        ['Country of Origin', 'India'],
        ['Destination', order.destinationCountry],
        ['Declared Product Information', product.name],
        ['HS Code', exportOrder.exportInfo?.hsCode || 'Not provided'],
        ['Purpose', exportOrder.exportInfo?.purpose || 'Not provided'],
        ['Declaration', 'I certify that the particulars given in this customs declaration are correct and that this item does not contain any dangerous article or articles prohibited by legislation or by postal or customs regulations.']
      ],
      columnStyles: { 0: { cellWidth: 50 } }
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // DNK Shipment Information
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('4. DNK Shipment Information — Prototype', margin, yPos);
    yPos += 8;

    autoTable(doc, {
      startY: yPos,
      theme: 'grid',
      headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold' },
      bodyStyles: { textColor: [51, 65, 85] },
      margin: { left: margin },
      body: [
        ['Order ID', order.id],
        ['Selected DNK', exportOrder.dnk || 'Not Selected'],
        ['Shipping Service', 'India Post / DNK-enabled international shipping'],
        ['Tracking Status', exportOrder.status === 'submitted' ? 'Submitted to DNK' : 'Pending DNK Submission']
      ],
    });

    // Footer on all pages
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      
      const footerY = doc.internal.pageSize.height - 15;
      doc.text('Dak Ghar Niryat Kendra — Export Preparation Platform', margin, footerY);
      doc.text('Prototype document — not an official government-issued customs document.', margin, footerY + 5);
      
      const pageString = `Page ${i} of ${pageCount}`;
      const pageStringWidth = doc.getTextWidth(pageString);
      doc.text(pageString, pageWidth - margin - pageStringWidth, footerY);
    }

    return doc;
  }
};
