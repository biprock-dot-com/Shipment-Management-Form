var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIML = "/api/iml ";
var jpdbIRL = " /api/irl";
var DBname = " SHIPMENT-DB";
var RelationName = "ShipmentData";
var connToken  = "90932242|-31949277085815251|90954325"


$("#shipno").focus();

function saveRecNo2LS(jsonObj)
{
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getShipmentnumberAsJsonObj()
{
    var shipno = $("#shipno").val();
    var jsonStr = {
        number : shipno,
    }
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj)
{
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;

    $("#description").val(record.about);
    $("#source").val(record.sourceAddress);
    $("#destination").val(record.destinationAddress);
    $("#shipdate").val(record.shipmentDate);
    $("#delidate").val(record.deiveryDate);
}

function resetform()
{
    $("#shipno").val(" ");
    $("#description").val(" ");
    $("#source").val(" ");
    $("#destination").val(" ");
    $("#shipdate").val(" ");
    $("#delidate").val(" ");
    $("#shipno").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#shipno").focus();
}


function validateData()
{
   var shipno, description, source, destination, shipdate, delidate;

   shipno = $("#shipno").val();
   description = $("#description").val();
   source =  $("#source").val();
   destination =  $("#destination").val();
   shipdate = $("#shipdate").val();
   delidate = $("#delidate").val();

   if(shipno === "")
   {
    alert("Shipment number missing.");
    $("#shipno").focus();
    return " ";
   }
   
   if(description === "")
   {
    alert("Description is missing.");
    $("#description").focus();
    return " ";
   }

   if(source === "")
   {
    alert("Source address is missing.");
    $("#source").focus();
    return " ";
   }

   if(destination === "")
   {
    alert("Destination address is missing.");
    $("#destination").focus();
    return " ";
   }

   if(shipdate === "")
   {
    alert("Shipment date is missing.");
    $("#shipdate").focus();
    return " ";
   }

   if(delidate=== "")
   {
    alert("Delivery date is  missing.");
    $("#delidate").focus();
    return " ";
   }

   var jsonStrObj = {
    number : shipno,
    about : description,
    sourceAddress : source,
    destinationAddress : destination,
    shipmentDate : shipdate,
    deliveryDate : delidate
   };

   return JSON.stringify(jsonStrObj);

}

function getInfo()
{
    var shipnoJsonObj = getShipmentnumberAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, DBname, RelationName,shipnoJsonObj );
    jQuery.ajaxSetup({async:false});
    var resJsonObj =  executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async:true});

    if(resJsonObj.status===400)
    {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#description").focus();
    }
    else if(resJsonObj.status===200)
    {
        $("#shipno").prop("disabled", true);
        fillData(resJsonObj);

        $("#update").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#description").focus();

    }
}

function savedata()
{
    var jsonStrObj = validateData();
    if(jsonStrObj===" ")
     return "";
    var putRequest = createPutRequest(connToken, jsonStrObj, DBname , RelationName);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL , jpdbIML);
    jQuery.ajaxSetup({async: true});
    Resetform();
    $("#shipno").focus();
}


function updatedata()
{
    $("#update").prop("disabled", true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, DBname, RelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async:true});
    console.log(resJsonObj);
    Resetform();
    $("#shipno").focus();
}
