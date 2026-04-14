import { RentHelpCredit } from '../models/RentHelpCredit.js';
import { Wallet } from '../models/Wallet.js';
import { WalletTransaction } from '../models/WalletTransaction.js';

export function startRentHelpJobRunner() {
  const run = async () => {
    const today = new Date();

    const overdueCredits = await RentHelpCredit.find({
      status: 'active',
      'installments.status': { $in: ['pending'] },
      'installments.dueDate': { $lte: today },
    });

    for (const credit of overdueCredits) {
      let hasLateInstallment = false;
      for (const installment of credit.installments) {
        if (installment.status === 'pending' && installment.dueDate <= today) {
          installment.status = 'late';
          installment.lateFee = Number((installment.lateFee + installment.amount * 0.02).toFixed(2));
          hasLateInstallment = true;
        }
      }

      if (hasLateInstallment) {
        const wallet = await Wallet.findOne({ userId: credit.tenantId });
        if (wallet) {
          wallet.isRentHelpBlocked = true;
          await wallet.save();
          await WalletTransaction.create({
            userId: credit.tenantId,
            type: 'rent_help_late_fee',
            amount: credit.installments
              .filter((x) => x.status === 'late')
              .reduce((sum, x) => sum + x.lateFee, 0),
            direction: 'debit',
            metadata: { rentHelpCreditId: credit._id, reason: 'late_installment' },
          });
        }

        if (credit.dueDate < today) {
          credit.status = 'defaulted';
        }

        await credit.save();
      }
    }
  };

  run().catch((error) => console.error('Rent Help job initial run failed', error));

  setInterval(() => {
    run().catch((error) => console.error('Rent Help job failed', error));
  }, 1000 * 60 * 60 * 24);
}
