let bankDatabase = {
    "123456": { pin: "1122", name: "Vishal Chaurasia", balance: 50000.0, status: "Active", account: "987654321", cif: "CIF001", ifsc: "CSEB0001", mobile: "9988776655" },
    "654321": { pin: "4433", name: "Rishikesh Singh", balance: 40000.0, status: "Active", account: "876543210", cif: "CIF002", ifsc: "CSEB0001", mobile: "8877665544" }
};

let currentCard = "";
let loginStep = "CARD_INPUT"; 

// एनीमेशन ट्रिगर करने वाला कॉमन हेल्पर फंक्शन
function triggerCardAnimation(callback) {
    const cardEl = document.getElementById("virtual-card");
    cardEl.classList.add("insert-animation"); // CSS एनीमेशन क्लास एक्टिव करें
    
    // 1200ms (1.2 सेकंड) के बाद लॉजिक एग्जीक्यूट होगा जब कार्ड अंदर चला जाएगा
    setTimeout(() => {
        callback();
    }, 1200);
}

function processCardInput() {
    let inputVal = document.getElementById("main-input").value.trim();
    
    if (loginStep === "CARD_INPUT") {
        if (!bankDatabase[inputVal]) {
            alert("Card not found! If it's a new card, click 'Activate Here'.");
            return;
        }
        if (bankDatabase[inputVal].status === "Blocked") {
            alert("This ATM Card is BLOCKED. Please contact your branch.");
            return;
        }
        
        currentCard = inputVal;
        
        // प्रोसीड करने पर कार्ड अंदर जाने का एनीमेशन चलेगा
        triggerCardAnimation(() => {
            loginStep = "PIN_INPUT";
            document.getElementById("display-msg").innerText = `Hello ${bankDatabase[currentCard].name},\nPlease enter your 4-Digit PIN:`;
            document.getElementById("main-input").value = "";
            document.getElementById("main-input").type = "password";
            document.getElementById("main-input").placeholder = "Enter PIN";
        });
    } 
    else if (loginStep === "PIN_INPUT") {
        if (bankDatabase[currentCard].pin === inputVal) {
            loginStep = "MENU";
            document.getElementById("display-msg").innerText = "Authentication Successful! Choose an option.";
            document.getElementById("main-input").style.display = "none";
            document.getElementById("auth-buttons").style.display = "none";
            document.getElementById("atm-menu").style.display = "block";
        } else {
            alert("Incorrect PIN! Access Denied.");
            exitATM();
        }
    }
}

function showActivationForm() {
    triggerCardAnimation(() => {
        document.getElementById("auth-buttons").style.display = "none";
        document.getElementById("main-input").style.display = "none";
        document.getElementById("display-msg").innerText = "NEW ATM CARD GENERATION / ACTIVATION";
        
        let formHTML = `
            <input type="text" id="new-card" placeholder="Create 6-Digit Card Number (e.g. 111222)">
            <input type="text" id="new-acc" placeholder="Enter Account Number">
            <input type="text" id="new-cif" placeholder="Enter CIF Code">
            <input type="text" id="new-ifsc" placeholder="Enter IFSC Code">
            <input type="text" id="new-mob" placeholder="Enter Mobile Number">
            <input type="password" id="new-pin" placeholder="Generate 4-Digit ATM PIN" maxlength="4">
            <button class="btn-enter" onclick="submitActivation()">Generate PIN & Activate</button>
            <button class="btn-exit" onclick="exitATM()">Cancel</button>
        `;
        document.getElementById("dynamic-form").innerHTML = formHTML;
        document.getElementById("dynamic-form").style.display = "block";
    });
}

function submitActivation() {
    let card = document.getElementById("new-card").value.trim();
    let acc = document.getElementById("new-acc").value.trim();
    let cif = document.getElementById("new-cif").value.trim();
    let ifsc = document.getElementById("new-ifsc").value.trim();
    let mob = document.getElementById("new-mob").value.trim();
    let pin = document.getElementById("new-pin").value.trim();

    if(!card || !acc || !cif || !ifsc || !mob || !pin) {
        alert("All fields are mandatory for ATM Activation!");
        return;
    }

    bankDatabase[card] = {
        pin: pin,
        name: "New Customer",
        balance: 5000.0,
        status: "Active",
        account: acc,
        cif: cif,
        ifsc: ifsc,
        mobile: mob
    };

    alert("Congratulations! Your ATM Card is activated and PIN generated successfully.");
    exitATM();
}

function checkBalance() {
    document.getElementById("display-msg").innerText = `Account No: XXXXXX${bankDatabase[currentCard].account.slice(-4)}\nCurrent Balance: ₹${bankDatabase[currentCard].balance.toFixed(2)}`;
}

function handleTransaction(type) {
    let amount = parseFloat(prompt(`Enter amount to ${type}:`));
    if (isNaN(amount) || amount <= 0) { return alert("Invalid Amount!"); }

    if (type === 'withdraw') {
        if (amount > bankDatabase[currentCard].balance) {
            alert("Transaction Failed! Insufficient Balance.");
        } else {
            bankDatabase[currentCard].balance -= amount;
            alert("Please collect your cash!");
        }
    } else {
        bankDatabase[currentCard].balance += amount;
        alert("Cash deposited successfully!");
    }
    checkBalance();
}

function changePinForm() {
    let oldPin = prompt("Enter your Current PIN:");
    if(oldPin === bankDatabase[currentCard].pin) {
        let newPin = prompt("Enter your NEW 4-Digit PIN:");
        if(newPin && newPin.length === 4 && !isNaN(newPin)) {
            bankDatabase[currentCard].pin = newPin;
            alert("PIN changed successfully! Please login again.");
            exitATM();
        } else { alert("Invalid New PIN Format!"); }
    } else { alert("Incorrect Old PIN!"); }
}

function blockCard() {
    let confirmBlock = confirm("Are you sure you want to BLOCK this ATM Card immediately?");
    if(confirmBlock) {
        bankDatabase[currentCard].status = "Blocked";
        alert("This card has been blocked. Transactions disabled.");
        exitATM();
    }
}

function exitATM() {
    currentCard = "";
    loginStep = "CARD_INPUT";
    
    // कार्ड को वापस बाहर निकालने के लिए एनीमेशन क्लास हटा दें
    document.getElementById("virtual-card").classList.remove("insert-animation");
    
    document.getElementById("dynamic-form").style.display = "none";
    document.getElementById("atm-menu").style.display = "none";
    document.getElementById("main-input").style.display = "block";
    document.getElementById("main-input").type = "text";
    document.getElementById("main-input").value = "";
    document.getElementById("main-input").placeholder = "Enter Card Number";
    document.getElementById("auth-buttons").style.display = "block";
    document.getElementById("display-msg").innerText = "Welcome! Please enter your 6-Digit Card Number to start.";
}
