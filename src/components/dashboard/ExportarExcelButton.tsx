import type { EncomiendaRich, Localidad } from '../../types/encomienda';
import React from 'react';
import ExcelJS from 'exceljs';

interface ExportarExcelButtonProps {
    encomiendas: EncomiendaRich[]
    localidad: Localidad[]
}

export const ExportarExcelButton: React.FC<ExportarExcelButtonProps> = ({
    encomiendas = []
    //localidad = []
}) => {
    const handleExportExcel = async () => {
        try {
            const today = new Date();
            const localidad = 'BAHIA BLANCA'; // Puedes hacerlo dinámico si lo necesitas
            const filename = `encomiendas_${today.toISOString().split('T')[0]}.xlsx`;

            // Crear un nuevo libro de trabajo
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Encomiendas');

            // Configurar ancho de columnas
            worksheet.columns = [
                { width: 30 }, // DIRECCIÓN
                { width: 60 }, // PEDIDO
                { width: 20 }, // COBRADO
            ];

            // Fila 1: Encabezado principal
            const headerRow = worksheet.addRow(['EXPRESO FV', '', `${localidad} ${today.toLocaleDateString('es-AR')}`]);
            headerRow.font = { bold: true, size: 18 };
            headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
            headerRow.height = /* 20 */45;
            headerRow.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.font = { bold: true, size: 14 };
            });

            // Fila 2: Encabezados de tabla
            const tableHeaderRow = worksheet.addRow(['DIRECCION', 'Descripcion', 'COBRADO']);
            tableHeaderRow.font = { bold: true, size: 11 };
            tableHeaderRow.alignment = { horizontal: 'center', vertical: 'middle' };
            tableHeaderRow.fill = {
                type: 'pattern' as const,
                pattern: 'solid' as const,
                fgColor: { argb: 'FFE0E0E0' } // Color gris más oscuro
            };
            tableHeaderRow.height = /* 18 */30;
            tableHeaderRow.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });

            // Agregar datos
            encomiendas.forEach((e) => {
                const dataRow = worksheet.addRow([
                    e.direccion_destino ?? '',
                    e.descripcion ?? '',
                    '' // COBRADO vacío, se completa a mano
                ]);
                dataRow.height = 20;
                dataRow.eachCell((cell, colNum) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    if (colNum === 1) {
                        cell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
                    } else if (colNum === 2) {
                        cell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
                    } else {
                        cell.alignment = { horizontal: 'center', vertical: 'top' };
                    }
                });
            });

            // Agregar filas vacías al final (para poder escribir a mano)
            for (let i = 0; i < 5; i++) {
                const emptyRow = worksheet.addRow(['', '', '']);
                emptyRow.height = 20;
                emptyRow.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });
            }

            // Descargar archivo (navegador)
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al exportar Excel:', error);
        }
    };

    return (
        <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
            📄 Exportar a Excel
        </button>
    );
};