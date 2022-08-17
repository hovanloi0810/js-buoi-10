// ======================= object constructor ===================
function Staff(id, name, email, password, date, salary, position, workTime) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.date = date;
    this.salary = salary;
    this.position = position;
    this.workTime = workTime;
}
Staff.prototype.sumSalary = function () {
    if (this.position === 'Sếp') {
        return this.salary * 3;
    }
    if (this.position === 'Trưởng phòng') {
        return this.salary * 2;
    }
    if (this.position === 'Nhân viên') {
        return this.salary * 1;
    }
}
Staff.prototype.classification = function() {
    if (this.workTime >= 192) {
        return 'xuất sắc';
    }
    if (this.workTime >= 176) {
        return 'giỏi';
    }
    if (this.workTime >= 160) {
        return 'khá';
    }
    if (this.workTime < 160) {
        return 'trung bình';
    }
}

let staffs = [];
init();
// =================== function =================
function init() {
    staffs =  JSON.parse(localStorage.getItem('staff')) || [];
    staffs = staffs.map((staff) => {
        return new Staff(staff.id, staff.name, staff.email, staff.password, staff.date, staff.salary, staff.position, staff.workTime);
    })

    display(staffs)
}

function addStaff() {
    // B1: Dom thông tin input
    let id = dom('#tknv').value;
    let name = dom('#name').value;
    let email = dom('#email').value;
    let password = dom('#password').value;
    let date = dom('#datepicker').value;
    let salary = +dom('#luongCB').value;
    let position = dom('#chucvu').value;
    let workTime = dom('#gioLam').value;

    let isValid = validateForm();
    if (!isValid) {
        return;
    }

    //B2: Tạo object lưu thông tin 
    let staff = new Staff(id, name, email, password, date, salary, position, workTime);
    // B3: add nhân viên vào danh sách
    staffs.push(staff);
    localStorage.setItem('staff', JSON.stringify(staffs));
    // B4: hiển thị ra ui
    display(staffs);
    resetForm();
}

function deleteStaff(staffId) {
    staffs = staffs.filter((staff) => {
        return staff.id !== staffId;
    });
    localStorage.setItem('staff', JSON.stringify(staffs));
    
    display(staffs);
}

function searchStaff() {
    let searchType = dom('#searchName').value;

    let newStaffs =  staffs.filter((staff) => {
        let type = staff.classification();
        return type.includes(searchType);
    })

    display(newStaffs);
}

function editStaff(staffId) {
    let staff = staffs.find((staff) => {
        return staff.id === staffId;
    });
    if (!staff) {
        return;
    }
    dom('#tknv').value = staff.id;
    dom('#name').value = staff.name;
    dom('#email').value = staff.email;
    dom('#password').value = staff.password;
    dom('#datepicker').value = staff.date;
    dom('#luongCB').value = staff.salary;
    dom('#chucvu').value = staff.position;
    dom('#gioLam').value = staff.workTime;
    
    dom('#tknv').disabled = true;
    dom('#btnThemNV').disabled = true;
}

function updateStaff() {
    let id = dom('#tknv').value;
    let name = dom('#name').value;
    let email = dom('#email').value;
    let password = dom('#password').value;
    let date = dom('#datepicker').value;
    let salary = +dom('#luongCB').value;
    let position = dom('#chucvu').value;
    let workTime = dom('#gioLam').value;
    let isValid = validateForm();
    if (!isValid) {
        return;
    }
    let staff = new Staff(id, name, email, password, date, salary, position, workTime);
    let idStaff = staffs.findIndex((item) => item.id === staff.id);
    staffs[idStaff] = staff;
    localStorage.setItem('staff', JSON.stringify(staffs));

    display(staffs);
    resetForm();
}

// =====================================
function display(staffs) {
    let html = staffs.reduce((result, staff) => {
        return  result + `
            <tr>
                <td>${staff.id}</td>
                <td>${staff.name}</td>
                <td>${staff.email}</td>
                <td>${staff.date}</td>
                <td>${staff.position}</td>
                <td>${staff.sumSalary()}</td>
                <td>${staff.classification()}</td>
                <td>
                    <button class="btn btn-success" onclick="editStaff('${staff.id}')" data-toggle="modal"
                    data-target="#myModal">Sửa</button>
                    <button class="btn btn-danger" onclick="deleteStaff('${staff.id}')">Xoá</button>
                </td>
            </tr>
        `
    }, '')
    dom('#tableDanhSach').innerHTML = html;
}

function dom(selector) {
    return document.querySelector(selector);
}

function resetForm() {
    // B1: Dom thông tin input
    dom('#tknv').value = '';
    dom('#name').value = '';
    dom('#email').value = '';
    dom('#password').value = '';
    dom('#datepicker').value = '';
    dom('#luongCB').value = '';
    dom('#chucvu').value = '';
    dom('#gioLam').value = '';

    dom('#tknv').disabled = false;
    dom('#btnThemNV').disabled = false;
}
// ========================= Validate ==================
function validateId() {
    let id = dom('#tknv').value;
    let notification = dom('#tbTKNV');
    
    if (!id) {
        notification.innerHTML = 'Tài khoản không để trống';
        return false;
    }

    if (id.length < 4 || id.length > 6) {
        notification.innerHTML = 'Tài khoản tối đa 4 - 6 ký số';
        return false
    }
    notification.innerHTML = '';
    return true;
}

function validateName() {
    let name = dom('#name').value;
    let notification = dom('#tbTen');

    if (!name) {
        notification.innerHTML = 'Tên không để trống';
        return false;
    }

    if (!(isNaN(name))) {
        notification.innerHTML = 'Tên nhân viên phải là chữ';
        return false;
    }

    notification.innerHTML = '';

    return true;
}

function validateEmail() {
    let email = dom('#email').value;
    let notification = dom('#tbEmail');

    if (!email) {
        notification.innerHTML = 'Email không để trống';
        return false;
    }

    let regex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
    if (!regex.test(email)) {
        notification.innerHTML = ' Email phải đúng định dạng';
    }
    notification.innerHTML = '';
    return true;
}

function validatePass() {
    let pass = dom('#password').value;
    let notification = dom('#tbMatKhau');

    if (!pass) {
        notification.innerHTML = 'Mật khẩu không để trống';
        return false;
    }

    let regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(pass)) {
        notification.innerHTML = ' mật khẩu phải đúng định dạng';
    }
    notification.innerHTML = '';
    return true;
}

function validateDate() {
    let date = dom('#datepicker').value;
    let notification = dom('#tbNgay');

    if (!date) {
        notification.innerHTML = 'ngày không để trống';
        return false;
    }

    let date_regex = /^\d{2}\/\d{2}\/\d{4}$/ ;
    if (!date_regex.test(date)) {
        notification.innerHTML = 'Phải đúng định dạng mm/dd/yyyy';
    }
    notification.innerHTML = '';
    return true;
}

function validateSalary() {
    let salary = +dom('#luongCB').value;
    let notification = dom('#tbLuongCB');

    if (!salary) {
        notification.innerHTML = 'lương không để trống';
        return false;
    }

    if (salary < 1e6 || salary > 2e7) {
        notification.innerHTML = '+ Lương cơ bản 1 000 000 - 20 000 000';
        return false
    }
    notification.innerHTML = '';
    return true;
}

function validatePosition() {
    let position = dom('#chucvu').value;
    let notification = dom('#tbChucVu');

    if (!position) {
        notification.innerHTML = 'Chức vụ phải chọn chức vụ hợp lệ';
        return false;
    }
    
    notification.innerHTML = '';
    return true;
}

function validateWorkTime() {
    let workTime = +dom('#gioLam').value;
    let notification = dom('#tbGiolam');

    if (!workTime) {
        notification.innerHTML = 'Số giờ làm không để trống';
        return false;
    }

    if (workTime < 80 || workTime > 200) {
        notification.innerHTML = 'Số giờ làm trong tháng 80 - 200 giờ';
        return false
    }
    
    notification.innerHTML = '';
    return true;
}

function validateForm() {
    let isValid = true;
    isValid = validateId() & validateName() & validateEmail() & validatePass() & validateDate() & validateSalary() & validateSalary() & validatePosition() & validateWorkTime();

    if (!isValid) {
        alert('form ko hợp lệ');
        return false
    }

    return true;
}