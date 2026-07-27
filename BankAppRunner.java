import java.util.*;

//Single Flow Console Application
//Implement problem-solving, OOD, Collections/DS concepts
//Test change
public class BankAppRunner {
    static Scanner sc = new Scanner(System.in);

    static Map<String, User> map = new HashMap<>();

    static {
        map.put("admin", new Admin("admin", "admin123"));
        map.put("rohit", new Customer("rohit", "rohit123",
                new CheckingAccount(100), new SavingsAccount(500)));
        map.put("mohit", new Customer("mohit", "mohit123",
                new CheckingAccount(200), new SavingsAccount(1000)));
        map.put("shobhit", new Customer("shobhit", "shobhit123",
                new CheckingAccount(50), new SavingsAccount(300)));
    }

    public static void main(String[] args) {
        printMessage("Welcome to our bank");

        boolean overallLoopFlag = true;
        while (overallLoopFlag) {
            // Main Flow Logic
            User loggedInUser = mylogin();
            redirect(loggedInUser);
            //

            overallLoopFlag = promptYesNo("Do you want to continue or not? Y/N");
        }

    }

    private static void redirect(User loggedInUser) {
        if (loggedInUser == null) {
            printMessage("Invalid Credentials!");
        } else if (loggedInUser instanceof Admin) {
            adminDashboard(loggedInUser);
        } else {
            customerDashboard(loggedInUser);
        }
    }

    private static void customerDashboard(User loggedInUser) {
        Customer customer = (Customer) loggedInUser;
        printMessage("Welcome, " + customer.getUsername() + " to your customer dashboard");

        boolean continueMenu = true;
        while (continueMenu) {
            int choice = RunBankChoices();

            switch (choice) {
                case 1:
                    System.out.print("Enter deposit amount for CHECKING: ");
                    try {
                        double checkingDeposit = Double.parseDouble(sc.nextLine());
                        customer.getCheckingAccount().deposit(checkingDeposit);
                    } catch (NumberFormatException e) {
                        printMessage("Invalid amount. Please enter a number.");
                    }
                    break;
                case 2:
                    System.out.print("Enter withdrawal amount for CHECKING: ");
                    try {
                        double checkingWithdraw = Double.parseDouble(sc.nextLine());
                        customer.getCheckingAccount().withdraw(checkingWithdraw);
                    } catch (NumberFormatException e) {
                        printMessage("Invalid amount. Please enter a number.");
                    }
                    break;
                case 3:
                    System.out.print("Enter deposit amount for SAVINGS: ");
                    try {
                        double savingsDeposit = Double.parseDouble(sc.nextLine());
                        customer.getSavingsAccount().deposit(savingsDeposit);
                    } catch (NumberFormatException e) {
                        printMessage("Invalid amount. Please enter a number.");
                    }
                    break;
                case 4:
                    System.out.print("Enter withdrawal amount for SAVINGS: ");
                    try {
                        double savingsWithdraw = Double.parseDouble(sc.nextLine());
                        customer.getSavingsAccount().withdraw(savingsWithdraw);
                    } catch (NumberFormatException e) {
                        printMessage("Invalid amount. Please enter a number.");
                    }
                    break;
                case 5:
                    System.out.println("Checking balance: $" + customer.getCheckingAccount().getBalance());
                    break;
                case 6:
                    System.out.println("Savings balance: $" + customer.getSavingsAccount().getBalance());
                    break;
                case -1:
                    continueMenu = false;
                    break;
                default:
                    System.out.println("Invalid selection.");
            }
        }
    }

    private static void adminDashboard(User loggedInUsername) {
        printMessage("Welcome, " + loggedInUsername + " to admin dashboard");
        RunAdminChoices();
    }

    private static boolean promptYesNo(String prompt) {
        while (true) {
            System.out.println(prompt);
            String input = sc.nextLine().trim();

            if (input.equalsIgnoreCase("Y")) {
                return true;
            } else if (input.equalsIgnoreCase("N")) {
                return false;
            } else {
                System.out.println("Please enter Y or N.");
            }
        }
    }

    private static void RunAdminChoices() {
        boolean continueLookup = true;

        while (continueLookup) {
            System.out.println("*******************************************");
            System.out.println("Enter a customer's username to see all available information (or -1 to quit)");
            String customerUsername = sc.nextLine();

            if (customerUsername.equals("-1")) {
                return;
            }

            User user = map.get(customerUsername);

            if (user == null || !(user instanceof Customer)) {
                printMessage("No customer found with username: " + customerUsername);
            } else {

                Customer customer = (Customer) user;

                System.out.println("Username: " + customer.getUsername());
                System.out.println("Checking balance: $" + customer.getCheckingAccount().getBalance());
                System.out.println("Savings balance: $" + customer.getSavingsAccount().getBalance());

                System.out.println("Checking transaction history:");
                for (String tx : customer.getCheckingAccount().getTransactionHistory()) {
                    System.out.println("  - " + tx);
                }

                System.out.println("Savings transaction history:");
                for (String tx : customer.getSavingsAccount().getTransactionHistory()) {
                    System.out.println("  - " + tx);
                }
            }

            continueLookup = promptYesNo("Look up another customer? Y/N");
        }
    }

    private static int RunBankChoices() {
        int choice;

        System.out.println("*******************************************");
        System.out.println("(1) to DEPOSIT to CHECKING ACCOUNT");
        System.out.println("(2) to WITHDRAW from CHECKING ACCOUNT");
        System.out.println("(3) to DEPOSIT to SAVINGS ACCOUNT");
        System.out.println("(4) to WITHDRAW from SAVINGS ACCOUNT");
        System.out.println("(5) to display CHECKING ACCOUNT BALANCE");
        System.out.println("(6) to display SAVINGS ACCOUNT BALANCE");
        System.out.println("(-1) to QUIT");

        System.out.println();
        System.out.print("Select an option: ");

        try {
            choice = Integer.parseInt(sc.nextLine());
        } catch (NumberFormatException e) {
            printMessage("Invalid selection. Please enter a number.");
            return -1;
        }

        System.out.println();
        System.out.println("You selected " + choice);
        return choice;
    }

    private static User mylogin() {
        System.out.println("Please enter username and password separated by space: ");
        String usernamePassword = sc.nextLine();
        String[] tokens = usernamePassword.split(" ");
        String enteredUsername = tokens[0];
        String enteredPassword = tokens[1];

        User user = map.get(enteredUsername);
        if (user != null && user.getPassword().equals(enteredPassword)) {
            return user;
        }

        return null;
    }

    private static void printMessage(String message) {
        System.out.println(message);
    }
}

abstract class User {
    private String username;
    private String password;

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    // Forces subclasses to define their own behavior
    public abstract String getRole();
}

class Admin extends User {
    public Admin(String username, String password) {
        super(username, password);
    }

    @Override
    public String getRole() {
        return "ADMIN";
    }
}

class Customer extends User {
    private CheckingAccount checkingAccount;
    private SavingsAccount savingsAccount;

    public Customer(String username, String password, CheckingAccount checkingAccount, SavingsAccount savingsAccount) {
        super(username, password);
        this.checkingAccount = checkingAccount;
        this.savingsAccount = savingsAccount;
    }

    @Override
    public String getRole() {
        return "CUSTOMER";
    }

    public CheckingAccount getCheckingAccount() {
        return checkingAccount;
    }

    public SavingsAccount getSavingsAccount() {
        return savingsAccount;
    }
}

abstract class Account implements AccountOperations {
    private double balance;
    private List<String> transactionHistory;

    public Account(double balance) {
        this.balance = balance;
        this.transactionHistory = new ArrayList<>();
    }

    @Override
    public void deposit(double amount) {
        this.balance += amount;
        transactionHistory.add("Deposited $" + amount);
    }

    @Override
    public void withdraw(double amount) {
        if (amount <= this.balance) {
            this.balance -= amount;
            transactionHistory.add("Withdrew $" + amount);
        } else {
            System.out.println("Insufficient funds.");
        }
    }

    @Override
    public void transfer(Account destination, double amount) {
        if (amount <= this.balance) {
            this.withdraw(amount);
            destination.deposit(amount);
            transactionHistory.add("Transferred $" + amount + " to another account");
        } else {
            System.out.println("Insufficient funds for transfer.");
        }
    }

    // no default implementation — forces each subclass to define it
    @Override
    public abstract void printInterestRate();

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    public List<String> getTransactionHistory() {
        return transactionHistory;
    }
}

class CheckingAccount extends Account {
    public CheckingAccount(double balance) {
        super(balance);
    }

    @Override
    public void printInterestRate() {
        System.out.println("Checking accounts do not earn interest.");
    }
}

class SavingsAccount extends Account {
    private double interestRate;

    public SavingsAccount(double balance) {
        this(balance, 0.02);
    }

    public SavingsAccount(double balance, double interestRate) {
        super(balance);
        this.interestRate = interestRate;
    }

    public void applyInterest() {
        double interest = getBalance() * interestRate;
        deposit(interest);
    }

    @Override
    public void printInterestRate() {
        System.out.println("Interest rate: " + (interestRate * 100) + "%");
    }
}

interface AccountOperations {
    void deposit(double amount);

    void withdraw(double amount);

    void transfer(Account destination, double amount);

    void printInterestRate();
}

// SavingsAccount always gives higher interest rate