
const $ = (id) => document.getElementById(id);

// Switch between calculators
document.querySelectorAll(".tab").forEach((button) => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach((tab) => {
            tab.classList.remove("active");
        });

        document.querySelectorAll(".panel").forEach((panel) => {
            panel.classList.remove("active");
        });

        button.classList.add("active");
        $(button.dataset.tab).classList.add("active");
    });
});

// Display a calculated result
function showResult(resultId, detailsId, cgpa, details) {
    $(resultId).textContent = cgpa.toFixed(2);
    $(detailsId).textContent = details;
    $(detailsId).classList.remove("error");
}

// Display an error message
function showError(resultId, detailsId, message) {
    $(resultId).textContent = "--";
    $(detailsId).textContent = message;
    $(detailsId).classList.add("error");
}

// Percentage to CGPA
$("percentageButton").addEventListener("click", () => {
    const raw = $("percentageValue").value;
    const percentage = Number(raw);
    const divisor = Number($("percentageDivisor").value);

    if (
        raw.trim() === "" ||
        !Number.isFinite(percentage) ||
        percentage < 0 ||
        percentage > 100
    ) {
        showError(
            "percentageResult",
            "percentageDetails",
            "Enter a percentage from 0 to 100."
        );
        return;
    }

    const cgpa = Math.min(10, percentage / divisor);

    showResult(
        "percentageResult",
        "percentageDetails",
        cgpa,
        "Calculated using divisor " + divisor
    );
});

// Create semester SGPA inputs
function createSGPAInputs() {
    const count = Number($("semesterCount").value);
    const container = $("sgpaInputs");

    container.innerHTML = "";

    for (let i = 1; i <= count; i++) {
        const label = document.createElement("label");
        label.htmlFor = "semester" + i;
        label.textContent = "Semester " + i + " SGPA";

        const input = document.createElement("input");
        input.id = "semester" + i;
        input.type = "number";
        input.min = "0";
        input.max = "10";
        input.step = "any";
        input.placeholder = "Example: 8.5";

        container.append(label, input);
    }

    $("sgpaResult").textContent = "--";
    $("sgpaDetails").textContent = "Out of 10";
    $("sgpaDetails").classList.remove("error");
}

$("semesterCount").addEventListener("change", createSGPAInputs);

// SGPA to CGPA using a simple average
$("sgpaButton").addEventListener("click", () => {
    const count = Number($("semesterCount").value);
    const sgpas = [];

    for (let i = 1; i <= count; i++) {
        const raw = $("semester" + i).value;
        const sgpa = Number(raw);

        if (
            raw.trim() === "" ||
            !Number.isFinite(sgpa) ||
            sgpa < 0 ||
            sgpa > 10
        ) {
            showError(
                "sgpaResult",
                "sgpaDetails",
                "Enter every SGPA between 0 and 10."
            );
            return;
        }

        sgpas.push(sgpa);
    }

    const cgpa =
        sgpas.reduce((total, value) => total + value, 0) /
        sgpas.length;

    showResult(
        "sgpaResult",
        "sgpaDetails",
        cgpa,
        "Average of " + count + " semester(s)"
    );
});

// Total marks to CGPA
$("marksButton").addEventListener("click", () => {
    const obtainedRaw = $("obtainedMarks").value;
    const maximumRaw = $("maximumMarks").value;

    const obtained = Number(obtainedRaw);
    const maximum = Number(maximumRaw);
    const divisor = Number($("marksDivisor").value);

    if (
        obtainedRaw.trim() === "" ||
        maximumRaw.trim() === "" ||
        !Number.isFinite(obtained) ||
        !Number.isFinite(maximum) ||
        obtained < 0 ||
        maximum <= 0 ||
        obtained > maximum
    ) {
        showError(
            "marksResult",
            "marksDetails",
            "Enter valid obtained and maximum marks."
        );
        return;
    }

    const percentage = (obtained / maximum) * 100;
    const cgpa = Math.min(10, percentage / divisor);

    showResult(
        "marksResult",
        "marksDetails",
        cgpa,
        "Percentage: " + percentage.toFixed(2) + "%"
    );
});

// Initialize semester fields
createSGPAInputs();
