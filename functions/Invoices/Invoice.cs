using System.Collections.Generic;
using System.Linq;

namespace Xania.Functions.Invoices
{
    public class Invoice
    {
        public string Number { get; set; }
        public string Description { get; set; }
        public string Date { get; set; }
        public IEnumerable<InvoiceLine> Lines { get; set; } = Enumerable.Empty<InvoiceLine>();
        public decimal TotalTax => Lines.Sum(e => e.Amount * e.Tax);
        public decimal TotalAmountExclTax => Lines.Sum(e => e.Amount);
        public decimal TotalAmountInclTax => TotalAmountExclTax + TotalTax;
        public Company Company { get; set; }
        public Sender Sender { get; set; }
        public int ExpirationDays { get; set; }
    }

    public class Sender
    {
        public string BankAccount { get; set; }
        public string Name { get; set; }
    }

    public class Company
    {
        public string Name { get; set; }
        public IEnumerable<string> AddressLines { get; set; }
    }

    public class InvoiceLine
    {
        public int Hours { get; set; }
        public string Description { get; set; }
        public decimal Tax { get; set; }
        public decimal Amount { get; set; }
    }
}
