import VueSweetalert2 from "vue-sweetalert2";

import "sweetalert2/dist/sweetalert2.min.css";
const obj = {
  /* test 등록하기
   * @param { Object } args
   * @param { string } args.args1 - 이것
   * @param { string } args.args2 - 저것
   * @param { string } args.args3 - 그것
   */
  PhoneMask(phoneNumber) {
    if (!phoneNumber) return phoneNumber;
    phoneNumber = phoneNumber.replace(/[^0-9]/g, "");
    let res = "";
    if (phoneNumber.length < 3) {
      res = phoneNumber;
    } else {
      if (phoneNumber.substr(0, 2) == "02") {
        if (phoneNumber.length <= 5) {
          //02-123-5678
          res = phoneNumber.substr(0, 2) + "-" + phoneNumber.substr(2, 3);
        } else if (phoneNumber.length > 5 && phoneNumber.length <= 9) {
          //02-123-5678
          res =
            phoneNumber.substr(0, 2) +
            "-" +
            phoneNumber.substr(2, 3) +
            "-" +
            phoneNumber.substr(5);
        } else if (phoneNumber.length > 9) {
          //02-1234-5678
          res =
            phoneNumber.substr(0, 2) +
            "-" +
            phoneNumber.substr(2, 4) +
            "-" +
            phoneNumber.substr(6);
        }
      } else {
        if (phoneNumber.length < 8) {
          res = phoneNumber;
        } else if (phoneNumber.length == 8) {
          res = phoneNumber.substr(0, 4) + "-" + phoneNumber.substr(4);
        } else if (phoneNumber.length == 9) {
          res =
            phoneNumber.substr(0, 3) +
            "-" +
            phoneNumber.substr(3, 3) +
            "-" +
            phoneNumber.substr(6);
        } else if (phoneNumber.length == 10) {
          res =
            phoneNumber.substr(0, 3) +
            "-" +
            phoneNumber.substr(3, 3) +
            "-" +
            phoneNumber.substr(6);
        } else if (phoneNumber.length > 10) {
          //010-1234-5678
          res =
            phoneNumber.substr(0, 3) +
            "-" +
            phoneNumber.substr(3, 4) +
            "-" +
            phoneNumber.substr(7);
        }
      }
    }
    return res;
  },
  bizNumMask(num) {
    var formatNum = "";

    try {
      if (num.length == 10) {
        formatNum = num.replace(/(\d{3})(\d{2})(\d{5})/, "$1-$2-$3");
      }
    } catch (e) {
      formatNum = num;

      console.log(e);
    }

    return formatNum;
  },
  replaceOnlyNum(num) {
    if (num == "" || num == undefined) {
      return "";
    }
    var regex = /[^0-9]/g;
    var result = num.replace(regex, "");
    return result;
  },
  resultAlert(isSuccess) {
    if (isSuccess) {
      VueSweetalert2({
        title: "수정되었습니다.",
        icon: "success",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    } else {
      VueSweetalert2({
        title: "등록이 실패되었습니다.",
        icon: "error",
        position: "top",
        showCancelButton: false,
        showConfirmButton: false,
        toast: true,
        timer: 1500,
      });
    }
  },
};

export default obj;
