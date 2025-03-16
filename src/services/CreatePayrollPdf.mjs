import PDFDocument from "pdfkit";
import { PassThrough } from "stream";
import path from "path";
import { fileURLToPath } from "url";
import * as Sentry from "@sentry/node";
const CreatePayrollPdf = (payrollData) => {
  try {
    //create a new PDF document
    const doc = new PDFDocument();
    // Create a PassThrough stream, which allows the data to pass through without any transformation
    const stream = new PassThrough();

    // Initialize an empty array to store the chunks of data as they arrive
    const chunks = [];

    // Listen for the 'data' event on the stream and push each chunk into the chunks array
    stream.on("data", (chunk) => chunks.push(chunk));

    // Listen for the 'end' event on the stream (no action is taken here)
    stream.on("end", () => {});

    // Pipe the PDF document into the stream
    doc.pipe(stream);

    // Get the dimensions of the current PDF page
    const { width, height } = doc.page;

    // Set the title of the PDF
    const pdfTitle = "COMPROBANTE DE PAGO";
    const titleX = 340; // Horizontal position of the title
    const titleY = 60; // Vertical position of the title

    // Style and draw the title text on the PDF
    doc.font("Helvetica-Bold").fontSize(13).text(pdfTitle, titleX, titleY);

    //Obtain the current file route
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const logoPath = path.join(
      __dirname,
      "..",
      "assets",
      "login",
      "company_logo.png"
    );

    //Insert the company logo
    doc.image(logoPath, 150, -15, {
      fit: [150, 150], //Adjust logo size
      align: "center",
      valign: "center",
    });

    //Document control ranks configuration
    let rowControlHeight = 15; //Height of each row
    let currentControlY = 47; //Initial position in and

    //Draw the control ranks
    for (let i = 0; i < 3; i++) {
      //Adjust the height of the last row
      if (i === 2) rowControlHeight = 28;
      doc
        .rect(28, currentControlY, width - 500, rowControlHeight)
        .lineWidth(1)
        .strokeColor("#000")
        .stroke();

      currentControlY += rowControlHeight; //Move the position and for the next row
    }

    //Company name
    const companyName = "JUVENTUS BAR";
    const companyNameX = 33; //Horizontal position
    const companyNameY = 52; //Vertical position
    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .text(companyName, companyNameX, companyNameY);

    //Document version
    const documentVersion = "VERSION 1";
    const documentVersionX = 33; //Horizontal position
    const documentVersionY = 67; //Vertical position
    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .text(documentVersion, documentVersionX, documentVersionY);

    //function to obtain the current date in Colombia
    const getTodayDateInColombia = () => {
      const colombiaDate = new Date().toLocaleString("es-CO", {
        timeZone: "America/Bogota",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      //Formato Esperado: "DD/MM/AAAA"
      const [day, month, year] = colombiaDate.split("/");

      return { day, month, year };
    };

    //Obtain the current date
    const dateInfo = getTodayDateInColombia();

    //Configure the date table
    const dateTable = {
      headers: ["DIA", "MES", "AÑO"],
      rows: [[dateInfo.day, dateInfo.month, dateInfo.year]],
    };

    let dateTableY = 81; //Initial position in and for the date table

    //Draw the headers of the date table
    doc.font("Helvetica-Bold").fontSize(8);
    dateTable.headers.forEach((header, i) => {
      doc.text(header, 37 + i * 35, dateTableY);
    });

    dateTableY += 14; //Move the position and for the data

    //Draw the data on date
    doc.font("Helvetica").fontSize(10);
    dateTable.rows.forEach((row) => {
      row.forEach((cell, i) => {
        doc.text(cell, 37 + i * 35, dateTableY);
      });
      dateTableY += 20;
    });

    //User data columns configuration
    let rowUserDataHeight = 35; //Height of each row
    let currentUserDataY = 120; //Initial position in and
    let currentX = 28; //initial coordinate
    let columnWidth; //Width of each column
    //Draw user data columns
    for (let i = 0; i < 4; i++) {
      if (i < 1) {
        columnWidth = width - 500;
      } else if (i > 1) {
        columnWidth = width - 520;
      } else {
        columnWidth = 230;
      }
      //Draw the rectangle of the column
      doc
        .rect(currentX, currentUserDataY, columnWidth, rowUserDataHeight)
        .lineWidth(1)
        .strokeColor("#000")
        .stroke();

      currentX += columnWidth; //Move the X position for the next column
    }

    //Configure the user data table
    const userDataTable1 = {
      headers: ["Identificación", "Nombre", "Fecha", "No.Comprobante"],
      rows: [
        [payrollData.identification, payrollData.name, payrollData.date, "1"],
      ],
    };

    let userDataTable1Y = 126; //Initial position in and for the data table
    let userDataTable1X; //X coordinate for each column

    //Draw the heads of the data table
    doc.font("Helvetica-Bold").fontSize(8);
    userDataTable1.headers.forEach((header, i) => {
      switch (header) {
        case "Nombre":
          userDataTable1X = 110;
          break;
        case "Fecha":
          userDataTable1X = 169;
          break;
        case "No.Comprobante":
          userDataTable1X = 145;
          break;
        default:
          userDataTable1X = 35;
          break;
      }
      doc.text(header, 37 + i * userDataTable1X, userDataTable1Y);
    });

    userDataTable1Y += 14; //Move the position and for the data

    //Draw the data in the data table
    doc.font("Helvetica").fontSize(10);
    userDataTable1.rows.forEach((row) => {
      row.forEach((cell, i) => {
        switch (i) {
          case 0:
            userDataTable1X = 110;
            break;
          case 1:
            userDataTable1X = 110;
            break;
          case 2:
            userDataTable1X = 169;
            break;
          case 3:
            userDataTable1X = 145;
            break;
          default:
            userDataTable1X = 35;
            break;
        }
        doc.text(cell, 37 + i * userDataTable1X, userDataTable1Y);
      });
    });

    //Configuration of the Second User Data Table
    let rowUserData2Height = 35; //Height of each row
    let currentUserData2Y = 155; //Initial position in and
    let current2X = 28; //initial coordinate
    let columnWidth2; //Width of each column

    //Draw the columns of the second data table
    for (let i = 0; i < 2; i++) {
      columnWidth2 = i === 1 ? 184 : 342;
      doc
        .rect(current2X, currentUserData2Y, columnWidth2, rowUserData2Height)
        .lineWidth(1)
        .strokeColor("#000")
        .stroke();

      current2X += columnWidth2; //Move the X position for the next column
    }

    //Configure the second user data table
    const userDataTable2 = {
      headers: ["Cargo", "Empresa"],
      rows: [[payrollData.position, "JUVENTUS BAR"]],
    };

    let userDataTable2Y = 162; //Initial position in and for the second table
    let userDataTable2X; //X coordinate for each column

    //Draw the headers of the second table
    doc.font("Helvetica-Bold").fontSize(8);
    userDataTable2.headers.forEach((header, i) => {
      switch (header) {
        case "Cargo":
          userDataTable2X = 110;
          break;
        case "Empresa":
          userDataTable2X = 340;
          break;
        default:
          userDataTable2X = 110;
          break;
      }
      doc.text(header, 37 + i * userDataTable2X, userDataTable2Y);
    });

    userDataTable2Y += 14; //Move the position and for the data

    //Draw the second table data
    doc.font("Helvetica").fontSize(10);
    userDataTable2.rows.forEach((row) => {
      row.forEach((cell, i) => {
        switch (i) {
          case 0:
            userDataTable2X = 110;
            break;
          case 1:
            userDataTable2X = 340;
            break;
          default:
            userDataTable2X = 35;
            break;
        }
        doc.text(cell, 37 + i * userDataTable2X, userDataTable2Y);
      });
    });

    //Configuration of the third user data table
    let rowUserData3Height = 35; //Height of each row
    let currentUserData3Y = 190; //Initial position in and
    let current3X = 28; //initial coordinate
    let columnWidth3; //Width of each column

    //Draw the columns of the third data table
    for (let i = 0; i < 2; i++) {
      columnWidth3 = i === 1 ? 184 : 342;
      doc
        .rect(current3X, currentUserData3Y, columnWidth3, rowUserData3Height)
        .lineWidth(1)
        .strokeColor("#000")
        .stroke();

      current3X += columnWidth3; //Move the X position for the next column
    }

    //Configure the third user data table
    const userDataTable3 = {
      headers: ["Ciudad:", "Salario Basico:"],
      rows: [
        [
          "Bogota",
          `$${(payrollData.basic_salary || 0).toLocaleString("es-CO", {
            minimumFractionDigits: 2,
          })}`,
        ],
      ],
    };

    let userDataTable3Y = 195; //Initial position in and for the third table
    let userDataTable3X; //X coordinate for each column

    //Draw the headers of the third table
    doc.font("Helvetica-Bold").fontSize(8);
    userDataTable3.headers.forEach((header, i) => {
      switch (header) {
        case "Ciudad":
          userDataTable3X = 110;
          break;
        case "Salario Basico:":
          userDataTable3X = 340;
          break;
        default:
          userDataTable3X = 110;
          break;
      }
      doc.text(header, 37 + i * userDataTable3X, userDataTable3Y);
    });

    userDataTable3Y += 18; //Move the position and for the data

    //Draw the data of the third table
    doc.font("Helvetica").fontSize(10);
    userDataTable3.rows.forEach((row) => {
      row.forEach((cell, i) => {
        switch (i) {
          case 0:
            userDataTable3X = 120;
            break;
          case 1:
            userDataTable3X = 340;
            break;
          default:
            userDataTable3X = 35;
            break;
        }
        doc.text(cell, 37 + i * userDataTable3X, userDataTable3Y);
      });
    });

    //Film detail table configuration
    const payrollDetailTable = {
      headers: ["DESCRIPCION", "HORAS", "DEVENGADOS", "DEDUCCIONES"],
      rows: payrollData.payrollDetail.map((item) => [
        item.description,
        item.hours,
        `$${(item.accrued ?? 0).toLocaleString("es-CO", {
          minimumFractionDigits: 2,
        })}`,
        `$${(item.deductions ?? 0).toLocaleString("es-CO", {
          minimumFractionDigits: 2,
        })}`,
      ]),
    };

    let payrollDetailTableY = 243; //Initial position in and for the detail table
    doc.font("Helvetica-Bold").fontSize(8);
    payrollDetailTable.headers.forEach((header, i) => {
      doc.text(header, 37 + i * 135, payrollDetailTableY);
    });

    payrollDetailTableY += 18; //Move the position and for the data
    doc.font("Helvetica").fontSize(10);
    payrollDetailTable.rows.forEach((row) => {
      row.forEach((cell, i) => {
        doc.text(cell, 37 + i * 135, payrollDetailTableY);
      });
      payrollDetailTableY += 15;
    });

    //Draw the ranks of the payroll detail table
    let rowPayrollDetailsHeight = 15; //Height of each row
    let currentPayrollDetailsHeightY = 238; //Initial position in and

    for (let i = 0; i < 3; i++) {
      switch (i) {
        case 0:
          rowPayrollDetailsHeight = 17;
          break;
        case 1:
          rowPayrollDetailsHeight = payrollDetailTable.rows.length * 17;
          break;
        default:
          rowPayrollDetailsHeight = 45;
          break;
      }

      //Draw the rectangle of the row
      doc
        .rect(
          28,
          currentPayrollDetailsHeightY,
          width - 86,
          rowPayrollDetailsHeight
        )
        .lineWidth(1)
        .strokeColor("#000")
        .stroke();

      currentPayrollDetailsHeightY += rowPayrollDetailsHeight; //Move the position and for the next row
    }
    //Function to calculate the accumulated total, ensuring that the data is numerical
    const accruedTotalFunction = (data) => {
      return data.reduce((acc, item) => {
        const value = parseFloat(item.accrued) || 0;
        return acc + value;
      }, 0);
    };

    //Function to calculate the total deductions, ensuring that the data is numerical
    const deductionsTotalFunction = (data) => {
      return data.reduce((acc, item) => {
        const value = parseFloat(item.deductions) || 0;
        return acc + value;
      }, 0);
    };

    //Total calculation
    const accruedTotal = accruedTotalFunction(payrollData.payrollDetail);
    const deductionsTotal = deductionsTotalFunction(payrollData.payrollDetail);

    //Calculate the difference between Accruedtotal and deductiuttal
    const netTotal = accruedTotal - deductionsTotal;

    //Function for format values ​​such as Colombian currency (COP)
    const formatAsCOP = (value) => {
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 2,
      }).format(value);
    };

    //format the totals
    const formattedAccruedTotal = formatAsCOP(accruedTotal);
    const formattedDeductionsTotal = formatAsCOP(deductionsTotal);
    const formattedNetTotal = formatAsCOP(Math.max(0, netTotal));
    //Configuration of the payroll summary table
    const summaryTable = [
      { header: "Devengado", value: formattedAccruedTotal },
      { header: "Deducciones", value: formattedDeductionsTotal },
    ];

    const startX = 34; //Initial position x
    const startY = currentPayrollDetailsHeightY - 35; //Initial position and
    const rowHeight = 20; //Height of each row
    const headerWidth = 80; //Width of the header column
    const valueWidth = 100; //Securities column width
    //Draw the summary table
    summaryTable.forEach((row, index) => {
      const y = startY + index * rowHeight;

      //Draw the header
      doc.font("Helvetica-Bold").text(row.header, startX, y, {
        width: headerWidth,
        align: "left",
      });

      //Draw the value
      doc.font("Helvetica-Bold").text(row.value, startX + headerWidth, y, {
        width: valueWidth,
        align: "left",
      });
    });

    //Configuration of the net table to be paid
    const netPayTable = [
      { header: "Neto a Pagar", value: formattedNetTotal },
      { header: "Recibi", value: "_____________" },
    ];

    const startX2 = 210; //Initial position x
    const startY2 = startY + 20; //Initial position and
    const rowHeight2 = 20; //Height of each row

    //Draw the net table to pay
    let x2 = startX2;
    let y2 = startY2;

    netPayTable.forEach((row, index) => {
      //Draw the header and value on the same line
      doc.font("Helvetica-Bold").text(`${row.header}:`, x2, y2, {
        width: 100,
        align: "left",
      });

      x2 += 70; //Move the X position for the value

      doc.font("Helvetica-Bold").text(row.value, x2, y2, {
        width: 100,
        align: "left",
      });

      x2 += 100; //Move the X position for the next pair

      //If you reach the end of the line, move to the next row
      if ((index + 1) % 3 === 0) {
        y2 += rowHeight2;
        x2 = startX2;
      }
    });

    //Write additional text in the PDF
    doc
      .fontSize(8)
      .font("Helvetica")
      .text(
        "Este comprobante de pago fue expedido a través de un sistema web.",
        startX,
        startY + 45
      );

    //Finish the document
    doc.end();
    //Wait for stream to finish and return the buffer
    // Return a new Promise to handle asynchronous processing
    return new Promise((resolve, reject) => {
      // Listen for the 'end' event on the stream
      stream.on("end", () => {
        // Concatenate all chunks into a single buffer
        const buffer = Buffer.concat(chunks);
        // Resolve the promise with the final buffer
        resolve(buffer);
      });

      // Listen for any errors on the stream
      stream.on("error", (error) => {
        // Reject the promise with the encountered error
        reject(error);
      });
    });
  } catch (error) {
    Sentry.captureException(error);
    throw error; // Relanzar el error para que pueda ser manejado externamente
  }
};

export default CreatePayrollPdf;
