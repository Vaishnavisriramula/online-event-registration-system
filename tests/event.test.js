const { Builder, By, until } = require("selenium-webdriver");

async function runTests() {
    const driver = await new Builder().forBrowser("chrome").build();
    const url = "http://localhost:3000";
    const email = `student${Date.now()}@gmail.com`;
    const password = "Test12345";

    try {
        // TC01: Open Registration Page
        await driver.get(url);
        await driver.findElement(By.id("studentSignupForm"));
        console.log("TC01 PASSED: Registration page opened");

        // TC02: Register with Valid Details
        await driver.findElement(By.id("signupName")).sendKeys("Test Student");
        await driver.findElement(By.id("signupEmail")).sendKeys(email);
        await driver.findElement(By.id("signupPassword")).sendKeys(password);
        await driver.findElement(By.css("#studentSignupForm button")).click();

        await driver.wait(until.elementTextContains(
            driver.findElement(By.id("authMessage")),
            "Student registered successfully"
        ), 5000);
        console.log("TC02 PASSED: Student registered successfully");

        // TC03: Submit Empty Form
        await driver.get(url);
        await driver.findElement(By.css("#studentSignupForm button")).click();

        const isInvalid = await driver.findElement(By.id("signupName"))
            .getAttribute("validity");

        const emptyValid = await driver.executeScript(
            "return document.getElementById('studentSignupForm').checkValidity()"
        );

        if (!emptyValid) {
            console.log("TC03 PASSED: Empty form rejected");
        } else {
            throw new Error("TC03 FAILED");
        }

        // TC04: Invalid Email
        await driver.findElement(By.id("signupName")).sendKeys("Test Student");
        await driver.findElement(By.id("signupEmail")).sendKeys("invalidemail");

        const validEmail = await driver.executeScript(
            "return document.getElementById('signupEmail').checkValidity()"
        );

        if (!validEmail) {
            console.log("TC04 PASSED: Invalid email rejected");
        } else {
            throw new Error("TC04 FAILED");
        }

        // TC05: Duplicate Email
        await driver.get(url);
        await driver.findElement(By.id("signupName")).sendKeys("Duplicate Student");
        await driver.findElement(By.id("signupEmail")).sendKeys(email);
        await driver.findElement(By.id("signupPassword")).sendKeys(password);
        await driver.findElement(By.css("#studentSignupForm button")).click();

        await driver.wait(until.elementTextContains(
            driver.findElement(By.id("authMessage")),
            "Email already registered"
        ), 5000);
        console.log("TC05 PASSED: Duplicate email rejected");

        // TC06: Login with Valid Credentials
        await driver.findElement(By.id("loginEmail")).sendKeys(email);
        await driver.findElement(By.id("loginPassword")).sendKeys(password);
        await driver.findElement(By.css("#studentLoginForm button")).click();

        await driver.wait(until.elementTextContains(
            driver.findElement(By.id("authMessage")),
            "Login successful"
        ), 5000);
        console.log("TC06 PASSED: Login successful");

        // TC07: View Registered Events
        await driver.findElement(By.id("eventList"));
        await driver.findElement(By.id("eventSelect"));
        console.log("TC07 PASSED: Event section displayed");

        console.log("\nAll 7 Selenium test cases passed!");

    } catch (error) {
        console.error("TEST FAILED:", error.message);
        process.exitCode = 1;
    } finally {
        await driver.quit();
    }
}

runTests();