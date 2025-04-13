
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
import { InvoiceItem } from '@/types/invoice';
import { Card } from '@/components/ui/card';

interface InvoiceTableProps {
  items: InvoiceItem[];
  updateItem: (id: string, field: string, value: string | number) => void;
  addItem: () => void;
  removeItem: (id: string) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  items,
  updateItem,
  addItem,
  removeItem
}) => {
  const handleNumberChange = (id: string, field: string, value: string) => {
    const numberValue = value === '' ? 0 : parseFloat(value);
    updateItem(id, field, numberValue);
  };

  return (
    <Card className="p-6 shadow-invoice border-invoice-border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg border-b-2 border-national-yellow pb-1">Line Items</h3>
        <Button onClick={addItem} className="bg-national-yellow hover:bg-national-yellow/80 text-black">
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>
      
      <div className="overflow-x-auto rounded-md border border-invoice-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-invoice-gray border-b border-invoice-border">
              <TableHead className="w-[200px] font-semibold text-invoice-text">Item/Service</TableHead>
              <TableHead className="w-[250px] font-semibold text-invoice-text">Description</TableHead>
              <TableHead className="w-[80px] font-semibold text-invoice-text">Qty</TableHead>
              <TableHead className="w-[100px] font-semibold text-invoice-text">Unit Price</TableHead>
              <TableHead className="w-[100px] font-semibold text-invoice-text">Total</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground bg-white">
                  No items added yet. Click 'Add Item' to add a new row.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => (
                <TableRow key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-invoice-gray/30'}>
                  <TableCell>
                    <Input
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      className="h-9 border-invoice-border"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="h-9 border-invoice-border"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      value={item.quantity === 0 ? '' : item.quantity}
                      onChange={(e) => handleNumberChange(item.id, 'quantity', e.target.value)}
                      className="h-9 border-invoice-border"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice === 0 ? '' : item.unitPrice}
                      onChange={(e) => handleNumberChange(item.id, 'unitPrice', e.target.value)}
                      className="h-9 border-invoice-border"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    ${item.total.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default InvoiceTable;
