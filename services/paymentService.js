const paymentModel = require("../models/Paymentmodel");
const billModel = require("../models/Billmodel");

const getPayments = async () => {
    return await paymentModel.getPayments();
};

const getPaymentByID = async (id) => {
    if (!id) throw new Error("Payment ID is required");

    const data = await paymentModel.getPaymentByID(id);
    if (!data) throw new Error("Payment not found");

    return data;
};

const getPaymentsByBill = async (bill_id) => {
    if (!bill_id) throw new Error("Bill ID is required");
    return await paymentModel.getPaymentsByBill(bill_id);
};

const createPayment = async (body) => {
    const { bill_id, amount, payment_method, payment_date, proof_image, remarks } = body;

    if (!bill_id || !amount) {
        throw new Error("bill_id and amount are required");
    }

    if (amount <= 0) throw new Error("amount must be greater than 0");

    const bill = await billModel.getBillByID(bill_id);
    if (!bill) throw new Error("Bill not found");

    if (bill.status === "Paid") {
        throw new Error("This bill is already fully paid");
    }

    // Guard against overpayment
    const balance = bill.total_amount - (bill.total_paid || 0);
    if (amount > balance) {
        throw new Error(`Payment amount ($${amount}) exceeds remaining balance ($${balance})`);
    }

    const result = await paymentModel.createPayment({
        bill_id,
        amount,
        payment_method: payment_method || "Cash",
        payment_date: payment_date || new Date(),
        proof_image: proof_image || null,
        remarks: remarks || null
    });

    if (!result.insertId) throw new Error("Failed to create payment");

    // Auto-update bill status (Unpaid → Partially Paid → Paid)
    await billModel.updateBillStatus(bill_id);

    return await paymentModel.getPaymentByID(result.insertId);
};

const updatePayment = async (id, body) => {
    if (!id) throw new Error("Payment ID is required");

    const existing = await paymentModel.getPaymentByID(id);
    if (!existing) throw new Error("Payment not found");

    const { amount, payment_method, payment_date, proof_image, remarks } = body;

    if (amount !== undefined && amount <= 0) {
        throw new Error("amount must be greater than 0");
    }

    const allowedMethods = ["Cash", "ABA", "Bank", "Other"];
    if (payment_method && !allowedMethods.includes(payment_method)) {
        throw new Error(`payment_method must be one of: ${allowedMethods.join(", ")}`);
    }

    const result = await paymentModel.updatePayment(id, {
        amount: amount || existing.amount,
        payment_method: payment_method || existing.payment_method,
        payment_date: payment_date || existing.payment_date,
        proof_image: proof_image ?? existing.proof_image,
        remarks: remarks ?? existing.remarks
    });

    if (result.affectedRows === 0) throw new Error("Update failed");

    // Re-sync bill status after edit
    await billModel.updateBillStatus(existing.bill_id);

    return await paymentModel.getPaymentByID(id);
};

const deletePayment = async (id) => {
    if (!id) throw new Error("Payment ID is required");

    const existing = await paymentModel.getPaymentByID(id);
    if (!existing) throw new Error("Payment not found");

    await paymentModel.deletePayment(id);

    // Re-sync bill status after removal
    await billModel.updateBillStatus(existing.bill_id);

    return { message: "Payment deleted" };
};

module.exports = {
    getPayments,
    getPaymentByID,
    getPaymentsByBill,
    createPayment,
    updatePayment,
    deletePayment
};