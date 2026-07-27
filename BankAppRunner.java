import java.util.*;

//Single Flow Console Application
//Implement problem-solving, OOD, Collections/DS concepts
//Test change
public class BankAppRunner {
    static Scanner sc = new Scanner(System.in);

    static Map<String, String> map = new HashMap<>();

    static {
        map.put("admin", "admin123");
        map.put("rohit", "rohit123");
        map.put("mohit", "mohit123");
        map.put("shobhit", "shobhit123");
    }

    public static void main(String[] args) {
        printMessage("Welcome to our bank");

        boolean overallLoopFlag = true;
        while (overallLoopFlag) {
            // Main Flow Logic
            String loggedInUsername = mylogin();
            redirect(loggedInUsername);
            //

            System.out.println("Do you want to continue or not? Y/N");
            if (sc.nextLine().equalsIgnoreCase("N")) {
                overallLoopFlag = false;
            }
        }

    }

    private static void redirect(String loggedInUsername) {
        if (loggedInUsername.isEmpty()) {
            printMessage("Invalid Credentials!");
            boolean overallContinueFlag = true;

        } else {
            if (loggedInUsername.equals("admin")) {
                adminDashboard(loggedInUsername);
            } else {
                customerDashboard(loggedInUsername);
            }
        }
    }

    private static void customerDashboard(String loggedinUsername) {
        printMessage("Welcome, " + loggedinUsername + " to your customer dashboard");
        int choice = RunBankChoices();
        // using SwitchCase present different customer menu options
        printMessage("Customer choice returned: " + choice);
    }

    private static void adminDashboard(String loggedInUsername) {
        printMessage("Welcome, " + loggedInUsername + " to admin dashboard");
        int choice = RunAdminChoices();
        // using SwitchCase present different admin menu options
        printMessage("Admin choice returned: " + choice);
    }

    private static int RunAdminChoices() {
        int choice;

        System.out.println("*******************************************");
        System.out.println("Enter a customer's username to see all available information");
        String customer = sc.nextLine();

        System.out.println( /*name, checking balance, savings balance, transaction history*/)
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

    private static String mylogin() {
        System.out.println("Please enter username and password separated by space: ");
        String usernamePassword = sc.nextLine();
        // validation
        String[] tokens = usernamePassword.split(" ");
        String enteredUsername = tokens[0];
        String enteredPassword = tokens[1];

        for (Map.Entry<String, String> me : map.entrySet()) {
            String username = me.getKey();
            String password = me.getValue();
            if (username.equals(enteredUsername) && password.equals(enteredPassword)) {
                return username;
            }
        }

        return "";
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

            public Customer(String username, String password) {
                super(username, password);
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