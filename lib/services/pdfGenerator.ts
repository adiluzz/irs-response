import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// For Next.js: Ensure we can access PDFKit font data
// PDFKit font data is in node_modules/pdfkit/js/data
// In Next.js, we need to ensure this path is accessible at runtime

interface PDFOptions {
  letterText: string;
  outputPath: string;
  appLogoPath?: string;
  irsLogoPath?: string;
  watermarkPath?: string;
  appName?: string;
}

export async function generatePDF(options: PDFOptions): Promise<Buffer> {
  const {
    letterText,
    outputPath,
    appLogoPath,
    irsLogoPath,
    watermarkPath,
    appName = 'TAC Emergency IRS Responder',
  } = options;

  return new Promise((resolve, reject) => {
    try {
      // Create PDF document
      const doc = new PDFDocument({
        size: 'LETTER',
        margins: {
          top: 72,
          bottom: 72,
          left: 72,
          right: 72,
        },
        // Use standard fonts that are built into PDFKit
        font: 'Helvetica',
      });

      // Collect PDF chunks in memory
      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });
      
      doc.on('end', () => {
        try {
          const pdfBuffer = Buffer.concat(chunks);
          // Write to file if outputPath is provided
          if (outputPath) {
            fs.writeFileSync(outputPath, pdfBuffer);
          }
          resolve(pdfBuffer);
        } catch (error) {
          reject(error);
        }
      });
      
      doc.on('error', (error) => {
        reject(error);
      });

      // Add watermark function (will be called for each page)
      const addWatermark = () => {
        if (watermarkPath && fs.existsSync(watermarkPath)) {
          try {
            doc.save();
            doc.opacity(0.1);
            const watermarkSize = Math.min(doc.page.width, doc.page.height) * 0.6;
            doc.image(
              watermarkPath,
              (doc.page.width - watermarkSize) / 2,
              (doc.page.height - watermarkSize) / 2,
              {
                width: watermarkSize,
                height: watermarkSize,
              }
            );
            doc.restore();
          } catch (error) {
            console.warn('Failed to add watermark image:', error);
          // Fallback to text watermark
          doc.save();
          doc.opacity(0.05);
          doc.fontSize(60);
          doc.text(appName, doc.page.width / 2, doc.page.height / 2, {
            align: 'center',
            width: doc.page.width,
          });
          doc.restore();
          }
        } else {
          // Text watermark fallback
          doc.save();
          doc.opacity(0.05);
          doc.fontSize(60);
          doc.text(appName, doc.page.width / 2, doc.page.height / 2, {
            align: 'center',
            width: doc.page.width,
          });
          doc.restore();
        }
      };

      // Add watermark to first page
      addWatermark();

      // Reset to top for content
      doc.y = 72;

      // Add logos at the top
      let logoY = 72;
      const logoHeight = 40;
      const logoSpacing = 20;

      if (appLogoPath && fs.existsSync(appLogoPath)) {
        try {
          doc.image(appLogoPath, 72, logoY, { width: logoHeight, height: logoHeight });
        } catch (error) {
          console.warn('Failed to load app logo:', error);
        }
      }

      if (irsLogoPath && fs.existsSync(irsLogoPath)) {
        try {
          doc.image(irsLogoPath, doc.page.width - 72 - logoHeight, logoY, {
            width: logoHeight,
            height: logoHeight,
          });
        } catch (error) {
          console.warn('Failed to load IRS logo:', error);
        }
      }

      // Move down after logos
      doc.y = logoY + logoHeight + logoSpacing;

      // Add letter content
      doc.fontSize(11);
      doc.font('Helvetica');
      const lines = letterText.split('\n');
      
      for (const line of lines) {
        if (line.trim() === '') {
          doc.moveDown(0.5);
        } else {
          // Check if line is a heading (all caps or starts with uppercase)
          const isHeading = /^[A-Z\s:]+$/.test(line.trim()) && line.trim().length < 100;
          if (isHeading) {
            doc.font('Helvetica-Bold');
            doc.fontSize(12);
            doc.text(line.trim(), {
              align: 'left',
              continued: false,
            });
            doc.font('Helvetica');
            doc.fontSize(11);
            doc.moveDown(0.3);
          } else {
            doc.text(line.trim(), {
              align: 'left',
              continued: false,
            });
            doc.moveDown(0.4);
          }
        }

        // Check if we need a new page
        if (doc.y > doc.page.height - 72) {
          doc.addPage();
          doc.y = 72;
          // Add watermark to new page
          addWatermark();
        }
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
