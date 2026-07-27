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
        String loggedInUsername = mylogin();
        // authenticateUser(loggedInUsername);

        if (loggedInUsername.isEmpty()) {
            printMessage("Invalid Credentials!");
            System.exit(1);
        } else {
            if (loggedInUsername.equals("admin")) {
                // adminDashboard();
            } else {
                // customerDashboard();
            }
        }

    }

    private static String mylogin() {
        System.out.println("Please enter username and password separated by space");
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

// Abstract Class Account
// CheckingsAccount extends Account
// SavingsAccount extends Account

// Interface AccountOperations: printInterestRate(), deposit, withdraw, transfer
// SavingsAccount always gives higher interest rate