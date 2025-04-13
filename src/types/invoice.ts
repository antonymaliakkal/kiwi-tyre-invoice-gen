
export interface InvoiceItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface VehicleInfo {
  registration: string;
  odometer: string;
  makeModel: string;
}

export interface InvoiceInfo {
  number: string;
  date: string;
  gstNumber: string;
  serviceDate: string;
  nextServiceDate: string;
  salesperson: string;
  enteredBy: string;
  crimNumber: string;
}

export interface CompanyInfo {
  name: string;
  address: string[];
  phone: string;
}

export interface Calculation {
  subtotal: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  gst: number;
  total: number;
  rounding: number;
}

export interface InvoiceData {
  items: InvoiceItem[];
  customerInfo: CustomerInfo;
  vehicleInfo: VehicleInfo;
  invoiceInfo: InvoiceInfo;
  companyInfo: CompanyInfo;
  calculation: Calculation;
  saleNote: string;
}
