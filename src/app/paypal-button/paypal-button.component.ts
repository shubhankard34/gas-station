import { Component, AfterViewChecked, Input, Output, EventEmitter } from '@angular/core';

declare let paypal: any;

@Component({
    selector: 'app-paypal-button',
    templateUrl: './paypal-button.component.html',
})
export class PaypalButtonComponent implements AfterViewChecked {
    @Input()
    public finalAmount: number;

    @Output()
    private successfullyPaid: EventEmitter<boolean> = new EventEmitter<boolean>();

    public addScript: boolean = false;

    public payPalConfig = {
        env: "sandbox",
        commit: true,
        client: {
            sandbox: "AbGCTq7H7EM7l8GqqFPgHyOA0fuXT7sQlkSHNOFdzqEMrbG-Hu5l0fzfjTBbp5AZmK5MYUXVPUESehav"
        },
        payment: (data, actions) => {
            return actions.payment.create(
                {
                    payment: {
                        transactions: [
                            {
                                amount: {
                                    total: this.finalAmount, currency: "INR"
                                }
                            }
                        ]
                    }
                }
            );
        },
        onAuthorize: (data, actions) => {
            return actions.payment.execute().then(
                (payment) => {
                    this.successfullyPaid.emit(true);
                }
            )
            .catch(
                (error) => {
                    this.successfullyPaid.emit(false);
                }
            );
        }
    }

    public ngAfterViewChecked(): void {
        if (!this.addScript) {
            this.addPaypalScript().then(
                () => {
                    paypal.Button.render(this.payPalConfig, "#paypal-button")
                }
            );
        }
    }

    private addPaypalScript() {
        this.addScript = true;
        return new Promise(
            (resolve, reject) => {
                let scriptTagElement = document.createElement("script");
                scriptTagElement.src = "https://www.paypalobjects.com/api/checkout.js";
                scriptTagElement.onload = resolve;
                document.body.appendChild(scriptTagElement);
            });
    }
}
