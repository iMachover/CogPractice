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
        int choice = RunBankChoices();
        // using SwitchCase present different admin menu options
        printMessage("Admin choice returned: " + choice);
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

class Bank {
    private int id;
    private String name;

    public Bank(int id, String name) {// 1,"ABC Digital Bank"
        this.id = id;
        this.name = name;
    }

    public Bank() {

    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

// Abstract Class User: username, password, isAdmin:true/false
// Class Admin extends User
// Class Customer extends User

abstract class Account {
    private double balance;

    public Account(double balance) {
        this.balance = balance;
    }

    public double getBalance(){
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }
}

class CheckingAccount extends Account {
    public CheckingAccount(double balance) {
        super(balance);
    }
}

class SavingsAccount extends Account {
    public SavingsAccount(double balance) {
        super(balance);
    }
}
// Interface AccountOperations: printInterestRate(), deposit, withdraw, transfer
// SavingsAccount always gives higher interest rate