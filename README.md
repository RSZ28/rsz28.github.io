<html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
            body{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 11pt;
                user-select:  text;
            }

            footer, a{
                user-select: none;
            }

            textarea{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 11pt;
            }

            .reloj{
                font-size: 15px;
                font-family: 'Segoe UI', sans-serif;
                margin: 11px 0;
            }

            .tab-buttons {
            display: flex;
            margin-bottom: 10px;
            }

            .subtab-buttons {
            display: flex;
            margin-bottom: 10px;
            }

            .generated-text{                
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 11pt;
                user-select: text;
                border: 1px solid #ccc;
                padding: 10px;
                cursor: text;
            }

            .generated-link a {
                user-select: text; /* Asegura que los enlaces también puedan seleccionarse */
                color: blue;
                text-decoration: underline;            
            }

            .generated-link a:focus {
                outline: none;
            }

            .tab-buttons button {
            padding: 10px 20px;
            border: 1px solid #ccc;
            background-color: #eee;
            cursor: pointer;
            margin-right: 5px;
            }

            .subtab-buttons button {
            padding: 10px 20px;
            border: 1px solid #ccc;
            background-color: #eee;
            cursor: pointer;
            margin-right: 5px;
            }

            .tab-buttons button.active {
            background-color: #ddd;
            font-weight: bold;
            }

            .subtab-buttons button.active {
            background-color: #ddd;
            font-weight: bold;
            }

            .tab-content {
            display: none;
            border: 1px solid #ccc;
            padding: 15px;
            }

            .subtab-content {
            display: none;            
            padding: 15px;
            }

            .tab-content.active {
            display: block;
            }

            .subtab-content.active {
            display: block;
            }

            .texto-copiable {
                border: 1px solid #ccc;
                padding: 10px;
                width: fit-content;
                user-select: text; /* permite seleccionar el texto */
            }

        </style>
        <title>Intune Templates</title>        
        <link rel="stylesheet" href="style.css">
        <script>
            let createdHD = [];
            var templatesContent = {};
            async function GetTemplates(tempID){
                //const url = 'https://raw.githubusercontent.com/RSZ28/Templates_Content/refs/heads/main/Templates_Content.json';

                try{
                    const rsp = await fetch("https://templatesapi-awgkb6azg4a8dcdm.centralus-01.azurewebsites.net/list");
                    if(!rsp.ok) throw new Error('Download Error');

                    const txt = await rsp.json();
                    var template = "";

                    txt.forEach(i => {
                        if(i.title === tempID) template = i.content;
                    });

                    return template;

                } catch(error){
                    console.error('Error: ',error);
                }

                
            }

            function boldString(str , substr){
                strRegExp = new RegExp(substr, 'g');
                return str.replace(strRegExp, '<b>'+substr+'</b>');
            }

            function getLastContact(){
                today = new Date();
                if(today.getDay() === 1 || today.getDay() === 2) today.SetDate(today.getDate()-4);
                else today.setDate(today.getDate()-2);
                
                return today;
            }

            function findHD(hdID, list){
                found = false;
                list.forEach(i =>{
                    if(hdID === i) return true;
                });
                return found;
            }

            async function getHolyDays(){

                try{
                    const rsp = await fetch("https://templatesapi-awgkb6azg4a8dcdm.centralus-01.azurewebsites.net/list");
                    if(!rsp.ok) throw new Error('Download Error');

                    const txt = await rsp.json();
                    var template = "";

                    const HDCont = document.getElementById("HDContainer");
                    HDs = [];
                   
                    txt.forEach(i => {
                        if(i.title.includes("FU_HD")){
                            HDs.push(i);
                        }
                    });

                    if(createdHD.length !== 0){
                        dlt = [];
                        createdHD.forEach(i => {
                            if(!HDs.find(h => i === h.title)) dlt.push(i);
                        });
                        dlt.forEach(i => {
                            document.getElementById("CNT_"+i).remove();
                            createdHD.splice(i);
                        });
                        if(createdHD.length === 0){
                            document.getElementById("ospButton").classList.add('active');
                            document.getElementById("fHD").classList.remove('active');
                            document.getElementById("f2").classList.remove('active');
                            document.getElementById("osp").classList.add('active');
                        }
                    }

                    if(HDs.length > 0){
                        HDs.forEach(f =>{
                            if(createdHD.length !== 0){
                                if(!createdHD.find(i => i === f.title)){
                                    cnt = document.createElement("div");
                                    cnt.id = "CNT_"+f.title;
                                    rd = document.createElement("input");
                                    rd.type = "radio";
                                    rd.name = "FU_HD";
                                    rd.value = f.title;
                                    cnt.appendChild(rd);
                                    lbl = document.createElement("label");
                                    lbl.for = f.title;
                                    lbl.innerHTML = f.displayName;
                                    cnt.appendChild(lbl);
                                    HDCont.appendChild(cnt);
                                    createdHD.push(f.title);
                                }
                            }
                            else{
                                cnt = document.createElement("div");
                                cnt.id = "CNT_"+f.title;
                                rd = document.createElement("input");
                                rd.type = "radio";
                                rd.name = "FU_HD";
                                rd.value = f.title;
                                cnt.appendChild(rd);
                                lbl = document.createElement("label");
                                lbl.for = f.title;
                                lbl.innerHTML = f.displayName;
                                cnt.appendChild(lbl);
                                HDCont.appendChild(cnt);
                                createdHD.push(f.title);
                            }
                            
                        });
                        
                        document.getElementById("fHD").style.display = "block";
                    }
                    else document.getElementById("fHD").style.display = "none";

                } catch(error){
                    console.error('Error: ',error);
                }
            }

            document.addEventListener("DOMContentLoaded", function() {
                //GetTemplates();
                SetName();
                function actualizarRelojes() {
                let date = new Date();                
                OSPDate.value = getLastContact().toISOString().split('T')[0];
                let ahora;
                const zonas = [
                    { id: 'pst', zona: 'America/Los_Angeles', nombre: 'Pacific Standard Time (PST)' },
                    { id: 'ast', zona: 'America/Puerto_Rico', nombre: 'Atlantic Standard Time (AST)' },
                    { id: 'mst', zona: 'America/Denver', nombre: 'Mountain Standard Time (MST)' },
                    { id: 'cst', zona: 'America/Chicago', nombre: 'Central Standar Time (CST)' },
                    { id: 'est', zona: 'America/New_York', nombre: 'Easter Standard Time (EST)' },
                    { id: 'nic', zona: 'America/Managua', nombre: 'Hora Nicaragua'},
                    { id: 'chl', zona: 'America/Santiago', nombre:'Hora de Chile'},
                    { id: 'col', zona: 'America/Bogota', nombre:'Hora de Colombia'},
                ];

                zonas.forEach(({ id, zona, nombre }) => {
                    ahora = date.toLocaleTimeString('en-US', {
                    timeZone: zona,
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                    });
                    document.getElementById(id).textContent = `${nombre}: ${ahora}`;
                });                
            }
            setInterval(getHolyDays,3000);
            ShowIM();
            Look4Cases();
            setInterval(actualizarRelojes, 1000);
            actualizarRelojes();
            });
        </script>
    </head>    
    <body>
        <h1>Intune QA Templates</h1>        
        <fieldset style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <legend><b>Time Zones</b></legend>
            <fieldset>
                <div class="reloj" id="nic"></div>
                <div class="reloj" id="chl"></div>
                <div class="reloj" id="col"></div>
                <div class="reloj" id="ast"></div>
            </fieldset>
            <fieldset>
                <div class="reloj" id="pst"></div>
                <div class="reloj" id="cst"></div>
                <div class="reloj" id="est"></div>
                <div class="reloj" id="mst"></div> 
            </fieldset>
        </fieldset>
        <fieldset style="display: none;">
            <legend><b>Engineer Alias</b></legend>
            <div>
                <legend>Alias: <input id="eAlias" placeholder="Here goes your Alias" onchange="SetDate()"></legend>
            </div>
        </fieldset>
        <!-- <fieldset style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;"> -->
        <fieldset>
            <fieldset>
                <legend style="display: none;"><b>Case Information</b></legend>
                <div style="display: none;">
                    <b style="color: #ff000f;">IT'S SEV A?</b>
                    <input type="checkbox" id="sevA" onchange="SetSEVAFollowUp()">
                </div>

                <div>
                    Do you know the client's name?
                    <input type="checkbox" id="nameRes" checked="True" onchange="SetName()">
                    <script>
                        function SetSEVAFollowUp(){
                            const subButtons = document.querySelectorAll('.subtab-btn');
                            const subContents = document.querySelectorAll('.subtab-content');
                            const buttons = document.querySelectorAll('.tab-btn');
                            const contents = document.querySelectorAll('.tab-content');
                            const sevA = document.getElementById("sevA").checked;
                            
                            subButtons.forEach(button => {
                                button.classList.remove('active');
                            });
                            subContents.forEach(cnt => {
                                cnt.classList.remove('active');
                            });
                            buttons.forEach(bnt => {
                                bnt.classList.remove('active');
                            });
                            contents.forEach(cnt => {
                                cnt.classList.remove('active');
                            });
                            
                            if(sevA === true){
                                document.getElementById("PCM").style.display = "none";
                                document.getElementById("tab4BNT").classList.add('active');
                                document.getElementById("tab4").classList.add('active');
                                document.getElementById("fA").classList.add('active');
                                document.getElementById("fAbutton").classList.add('active');
                            }
                            else{
                                document.getElementById("PCM").style.display = "block";
                                document.getElementById("tab2BNT").classList.add('active');
                                document.getElementById("tab2").classList.add('active');
                                document.getElementById("f1").classList.add('active');
                                document.getElementById("fButton").classList.add('active');
                            }
                        }

                        function SetName(){
                            const check = document.getElementById("nameRes");
                            const field = document.getElementById("clientNameF");
                            field.value = check.checked ? "" : "Admin";
                            field.readOnly = !check.checked ? true : false;
                        }
                    </script>
                </div>
                <div>
                    Client's First name:
                    <input type="text" id="clientNameF" placeholder="Here goes the client's name">
                </div>
                <div>
                    Case number: 
                    <style>
                        input[type=number]::-webkit-inner-spin-button,
                        input[type=number]::-webkit-outer-spin-button{
                            -webkit-appearance: none;
                            margin: 0;
                        }

                        input[type=number]{
                            appearance: textfield;
                        }
                    </style>
                    <input type="number" id="caseNumF" placeholder="Here goes the case number">
                </div>
                <div style="display: none;">
                    Client's Email:
                    <input type="email" id="clientEmailF" placeholder="Here goes the client's email">
                </div>
                <div style="display: none;">
                    Client's Phone Number:
                    <input type="text" id="clientPhoneF" placeholder="Here goes the client's phone">
                </div>
                <legend>Case Languange:</legend>
                <div>
                    <input type="radio" id="eng" name="language" value="eng" checked="True">
                    <label for="eng">English</label>
                    <input type="radio" id="esp" name="language" value="esp">
                    <label for="esp">Spanish</label>
                </div>
                <div id="PCM">
                    <legend>Case PCM:</legend>
                    <div>
                        <input type="radio" id="email" name="pcm" value="email" checked="true" onclick="ShowPHTypes()">
                        <label for="email">Email</label>
                        <input type="radio" id="phone" name="pcm" value="phone" onclick="ShowPHTypes()">
                        <label for="phone">Phone</label>
                    </div>
                </div>
                <button onclick="ClearFields()">Clear Fields</button>
                <script>
                    const slaLanguage = document.querySelectorAll('input[name="language"]');
                    const cKName = document.getElementById("nameRes");
                    const cName = document.getElementById("clientNameF");
                    const cNumber = document.getElementById("caseNumF");
                    const cEmail = document.getElementById("clientEmailF");
                    const cPhone = document.getElementById("clientPhoneF");

                    function ClearFields(){
                        cNumber.value = "";
                        cEmail.value = "";
                        cPhone.value = "";
                        if(cKName.checked === true) {
                            cName.value = "";
                        }
                        //slaLanguage.forEach(r => r.checked = false);
                    }
                </script>
            </fieldset>
            <fieldset style="display: none;">
                <legend><b>Stored Cases</b></legend>
                <div id="storedC">

                </div>
                <script>
                    function ClearButtonsPane(){
                        const casesPane = document.getElementById("storedC");

                        casesPane.childNodes.forEach(function (c) {
                            casesPane.removeChild(c)
                        });

                    }

                    function Look4Cases(){
                        const allKeys = Object.keys(localStorage);
                        const casesPane = document.getElementById("storedC");

                        ClearButtonsPane();

                        if(allKeys.length > 0){
                            for(let i=0; i<allKeys.length;i++){
                                let C = JSON.parse(localStorage.getItem(allKeys[i]));
                                let btn = document.createElement("button");
                                btn.name = C.cNumber;
                                btn.textContent = "Case: "+C.cNumber;
                                
                                btn.onclick = function () {GetCase(btn);};
                                casesPane.appendChild(btn);
                            }
                        }
                    }
                </script>
            </fieldset>
        </fieldset>

        <div class="tab-buttons">
            <button class="tab-btn" data-tab="tab1" style="display: none;">Master Note</button>
            <button class="tab-btn active" id="tab2BNT" data-tab="tab2">SLA</button>
            <button class="tab-btn" id="tab4BNT" data-tab="tab4">Follow Up</button>
            <button class="tab-btn" data-tab="tab5">Closure</button>
            <button class="tab-btn" data-tab="tab6">SAW Request</button>
            <button class="tab-btn" data-tab="tab7">22 Days Note</button>
            <button class="tab-btn" disabled="false" data-tab="tab8">IET</button>
        </div>

        <!--Master Note-->
        <div id="tab1" class="tab-content">
            <fieldset>
                <legend>Case Missing Information</legend>                
                <div>
                    <legend>Is SAW Request? <input type="checkbox" id="SAW" onchange="HideDeviceInfo()"></legend>
                </div>

                <div>
                    <legend>Customer Type:</legend>
                    <input type="radio" id="prem" name="cType" value="Premier" onchange="ShowIM()">
                    <label for="prem">Premier</label>
                    <input type="radio" id="part" name="cType" value="Partner" onchange="ShowIM()">
                    <label for="part">Partner</label>
                    <input type="radio" id="pro" name="cType" value="Pro" checked="True" onchange="ShowIM()" onload="ShowIM()">
                    <label for="pro">Pro</label>
                </div>
            
                <div id="imInfo">
                    <legend>IM Name: <input type="text" id="imName" placeholder="Here goes the IM Name"></legend>
                    <legend>IM Contact: <input type="text" id="imCont" placeholder="Here goes the IM contact"></legend>
                </div>

                <div>
                    <legend>Country: <input type="text" id="country" placeholder="Customer Country"></legend>
                    <legend>Time Zone: <input type="text" id="TZ" placeholder="Customer Time Zone"></legend>
                </div>
                <script>
                    function HideDeviceInfo(){
                        let SAW = document.getElementById("SAW").checked;
                        if(SAW === true){
                            document.getElementById("deviceInfo").style.display = "none";
                            document.getElementById("policyInfo").style.display = "none";
                        }
                        else{
                            document.getElementById("deviceInfo").style.display = "block";
                            document.getElementById("policyInfo").style.display = "block";
                        }
                    }

                    function ShowIM()
                    {
                        const res = document.querySelector('input[name="cType"]:checked').value;

                        if(res === "Pro"){
                            document.getElementById("imInfo").style.display = "none";
                            document.getElementById("imName").value = "N/A";
                            document.getElementById("imCont").value = "N/A";
                        }
                        else{
                            document.getElementById("imInfo").style.display = "block";
                            document.getElementById("imName").value = "";
                            document.getElementById("imCont").value = "";
                        }
                    }
                </script>
            </fieldset>
            <fieldset>
                <legend>Objective</legend>
                <div>
                    <legend>Tenant ID: <input type="text" id="tID" placeholder="Here goes the Tenant ID"></legend>
                    <legend>MDM Authority: <input type="text" id="mdm" placeholder="Here goes the MDM Authority"></legend>
                    <legend>ASU: <input type="text" id="asu" placeholder="Here goes the ASU"></legend>
                    <legend>Environment: <input type="text" id="env" placeholder="Here goes the case Environment"></legend>
                    <legend>Date Issue Started: <input type="text" id="issueS" placeholder="Here goes when issue started"></legend>
                    <legend>Customer repro only? <input type="checkbox" id="reproOnly"></legend>
                    <legend>Are you able to reproduce the same problem in your tenant? <input type="checkbox" id="intRepro"></legend>
                    <div id="steps">
                        <legend>Repro Steps:</legend>
                    </div>
                </div>
            </fieldset>
            <fieldset id="deviceInfo">
                <legend>Info for Intune Cases</legend>
                <div>
                    <legend><b>User Info:</b></legend>
                    <div>
                        <legend>UPN: <input type="text" id="upn" placeholder="Here goes the User UPN"></legend>
                        <legend>User ID: <input type="text" id="uID" placeholder="Here goes the User ID"></legend>
                    </div>
                </div>
                <div>
                    <legend><b>Device Info:</b></legend>
                    <div>
                        <legend>Intune Device ID: <input type="text" id="deviceID" placeholder="Here goes the Intune Device ID"></legend>
                        <legend>Device Name: <input type="text" id="deviceName" placeholder="Here goes the Device Name"></legend>
                        <legend>Serial Number: <input type="text" id="serialNum" placeholder="Here goes the Serial Number"></legend>
                        <legend>Device Platform: <select id="OS">
                            <option value="Windows">Windows</option>
                            <option value="Android">Android</option>
                            <option value="iOS/iPadOS">iOS/iPadOS</option>
                            <option value="MacOS">MacOS</option>
                            <option value="Linux">Linux</option>
                        </select></legend>
                        <legend>OS Version & Build: <input type="text" id="OSversion" placeholder="Here goes the OS Version and Build"></legend>
                        <legend>Enrollment Method Used: <input type="text" id="enrMethod" placeholder="Here goes the enrollment method"></legend>
                    </div>
                </div>
            </fieldset>
            <fieldset id="policyInfo">
                <legend>Should be collected if related to Issue</legend>
                <div>
                    <legend>Policy/Profile Name: <input type="text" id="policyName" placeholder="Here goes the policy or profile name"></legend>
                    <legend>Policy ID: <input type="text" id="policyID" placeholder="Here goes the policy ID"></legend>
                    <legend>Policy Type: <input type="text" id="policyType" placeholder="Here goes the policy type"></legend>
                    <legend>Affected Settings: </legend>
                </div>

                <div>
                    <legend>Assigend to: <select id="assignment">
                        <option value="Devices">Devices</option>
                        <option value="Users">Users</option>
                    </select></legend>
                    <legend>App Name: <input type="text" id="appName" placeholder="Here goes the App name"></legend>
                    <legend>App ID: <input type="text" id="appID" placeholder="Here goes the App ID"></legend>                    
                </div>
            </fieldset>

            <fieldset>
                <legend>Completed Actions Taken and Results</legend>
                <div id="newAction" style="display: none;">
                    <div id="date"></div>
                    <div id="notes" style="display: block;">
                        <fieldset contenteditable="true" id="dayResum" style="
                            width: 400pt;
                            height: 150pt;
                            text-align: left;
                            vertical-align: top;
                            padding: 0.5em;
                            overflow: auto;
                            word-wrap: break-word;
                            white-space: pre-wrap;"
                            rows="5" cols="30"></fieldset>
                    </div>
                    <button onclick="MasterNote()">Save Master Note</button>
                </div>
                <script>
                    function SetDate(){
                        let alias = document.getElementById("eAlias").value;
                        if(alias.includes("@microsoft.com")){
                            const date = new Date();
                            document.getElementById("date").innerHTML = date.toLocaleDateString('en-US', {
                                month:'2-digit',
                                day: '2-digit'
                            })+" - " + "<b>"+alias+"</b>";
                            //document.getElementById("notes").style.display = "block";
                            //document.getElementById("date").style.display = "block";
                            document.getElementById("newAction").style.display = "block";
                        }
                        else{
                            //document.getElementById("notes").style.display = "none";
                            document.getElementById("newAction").style.display = "none";
                            //document.getElementById("date").style.display = "none";
                        }
                    }
                </script>
            </fieldset>

            <fieldset>
                <legend>Master Note</legend>
            </fieldset>

            <script>
                function MasterNote(){
                    let ms = {
                        cName: cName.value,
                        cNumber: cNumber.value,
                        cEmail: cEmail.value,
                        cPhone: cPhone.value,
                        cLanguage: slaLanguage.value
                    }                    

                    let stCase = localStorage.getItem(ms.cNumber);
                    if(stCase !== null){
                        let stored = JSON.parse(localStorage.getItem(ms.cNumber));
                        Object.keys(ms).forEach(function (k){
                            stored[k] = ms[k];
                        });

                        localStorage.setItem(ms.cNumber, JSON.stringify(stored));
                    }
                    else{
                        localStorage.setItem(ms.cNumber, JSON.stringify(ms));
                    }

                    Look4Cases();
                }
                function GetCase(button){                    
                    let data = JSON.parse(localStorage.getItem(button.name));
                    cName.value = data.cName;
                    cNumber.value = data.cNumber;
                    cEmail.value = data.cEmail;
                    cPhone.value = data.cPhone;
                    //slaLanguage = data.slaLanguage;
                    
                }
            </script>
        </div>

        <!--SLA-->
        <div id="tab2" class="tab-content active">
            <script>
                function ShowPHTypes(){
                    ShowPendingCX();
                    const slaType = document.querySelector('input[name="pcm"]:checked').value;
                    document.getElementById("eN").style.display = "none";
                    if(slaType === "email"){
                        document.getElementById("PH").style.display = "none";
                    }
                    if(slaType === "phone"){
                        document.getElementById("PH").style.display = "block";
                    }
                }
            </script>

            <fieldset id="PH" style="display: none;">
                <legend>SLA Type</legend>
                <div>
                    <input type="radio" name="phType" id="ph0" value="ph0" checked="true">
                    <label for="ph0">Answered Call</label>
                    <input type="radio" name="phType" id="ph1" value="ph1">
                    <label for="ph1">Long Call</label>
                    <input type="radio" name="phType" id="ph2" value="ph2">
                    <label for="ph2">Call not responded</label>
                </div>
            </fieldset>
            
            <fieldset id="eN" style="display: none;">
                <legend>Extra Details</legend>
                <div>
                    Engineer name:
                    <input type="text" id="eName">
                </div>
            </fieldset>
            
            <fieldset>
                <legend>Case Parafrasing:</legend>
                <input type="text" id="cDes" placeholder="Here goes a brief parafrasing" style="height: 25px; width: 400px;">
            </fieldset>
            <div>
                <button id="premSLA" onclick="GenerateSLA()">Generate SLA</button>
            </div>           

            <script>
                async function GenerateSLA(){
                    const slaType = document.querySelector('input[name="pcm"]:checked').value;
                    const phType = document.querySelector('input[name="phType"]:checked').value;
                    const slaLanguage = document.querySelector('input[name="language"]:checked').value;
                    const eName = document.getElementById("eName").value;
                    const cKName = document.getElementById("nameRes").value;
                    const cName = document.getElementById("clientNameF").value;
                    const cNumber = document.getElementById("caseNumF").value;
                    const cEmail = document.getElementById("clientEmailF").value;
                    const cPhone = document.getElementById("clientPhoneF").value;
                    const cDesc = document.getElementById("cDes").value;
                    let template = "";

                    if(slaLanguage === "eng"){
                        if(slaType === "email") template = await GetTemplates("SLA_EM_ENG");
                        else if(slaType === "phone"){
                            if(phType === "ph0") template = await GetTemplates("SLA_ANW_ENG");
                            else if(phType === "ph1") template = await GetTemplates("SLA_LC_ENG");
                            else if(phType === "ph2") template = await GetTemplates("SLA_NANW_ENG");
                        }
                    }
                    else if(slaLanguage === "esp"){
                        if(slaType === "email") template = await GetTemplates("SLA_EM_ESP");
                        else if(slaType === "phone"){
                            if(phType === "ph0") template = await GetTemplates("SLA_ANW_PH_ESP");
                            else if(phType === "ph1") template = await GetTemplates("SLA_LC_PH_ESP");
                            else if(phType === "ph2") template = await GetTemplates("SLA_NANW_PH_ESP");
                        }
                    }

                    console.log("PCM "+slaType+"\nLanguage "+slaLanguage+"\nPHtype "+phType);
                    if(template.includes("NAME")) template = template.replace("NAME",cName);
                    if(template.includes("EM")) template = template.replace("EM", "<b>"+cEmail+"</b>");
                    if(template.includes("PH")) template = template = template.replace("PH","<b>" + cPhone +"</b>");
                    if(template.includes("TICKET")) template = template.replace("TICKET","<b>" + cNumber + "</b>");
                    if(template.includes("DESC")) template = template.replace("DESC", "<b>" + cDesc + "</b>");

                    document.getElementById("premResult").innerHTML = template.replace(/\n/g,"<br>");
                }
            </script>

            <fieldset>
                <legend>SLA Generation</legend>
                <div class="generated-text" id="premResult" onpaste="return false" contenteditable="true"></div>
                <script>
                    let SLActrl = false;
                    let SLAe = false;

                    document.getElementById("premResult").addEventListener("keyup",function(event){
                        if(event.ctrlKey){
                            ctrl=true;
                        }
                        if(event.key === 'c' || event.key === 'C'){
                            event.preventDefault();
                            e = true;
                        }
                    });

                    document.getElementById("premResult").addEventListener("keydown", function(event) {
                        //const selectedText = window.getSelection().toString();
                        if(event.ctrlKey){
                            ctrl=true;
                        }
                        else{
                            event.preventDefault();
                        }
                        if(event.key === 'c' || event.key === 'C'){                            
                            e = true;
                        }
                        else{
                            event.preventDefault()
                        }
                    });
                </script>
            </fieldset>

        </div>

        <!--Follow Up-->
        <div id="tab4" class="tab-content">
            <div class="subtab-buttons">
                <button class="subtab-btn" id="fAbutton" data-tab="fA" style="display: none;">SEV A</button>
                <button class="subtab-btn" id="fButton" data-tab="f1" style="display: block;">Strike</button>
                <button class="subtab-btn active" id="ospButton" data-tab="osp">OSP</button>
                <button class="subtab-btn" id="fHD" style="display: none; "data-tab="f2">Holydays</button>
            </div>

            <script>
                function ShowPendingCX(){
                    const slaType = document.querySelector('input[name="pcm"]:checked').value;
                    document.getElementById("eN").style.display = "none";
                    if(slaType === "email"){
                        document.getElementById("pendingInfo").style.display = "block";
                        document.getElementById("phLCA").style.display = "none";
                    }
                    if(slaType === "phone"){
                        document.getElementById("pendingInfo").style.display = "none";
                        document.getElementById("phLCA").style.display = "block";
                    }
                }

                function ShowLCADate(){
                    let wrn = document.getElementById("OSPEnd").checked;
                    //console.warn(wrn);
                    if(wrn) document.getElementById("dateCont").style.display = "block";
                    else document.getElementById("dateCont").style.display = "none";
                }
            </script>

            <fieldset id="fA" class="subtab-content">
                <legend>SEV A Unresponsive Process</legend>
                <div>
                    <legend>Follow Up Number:</legend>
                    <input type="radio" id="stA" name="sAnum" value="1" checked>
                    <label for="stA">1</label>
                    <input type="radio" id="ndA" name="sAnum" value="2">
                    <label for="ndA">2</label>
                    <input type="radio" id="thA" name="sAnum" value="3">
                    <label for="thA">3</label>
                </div>
                <div><legend>Time of the Call UTC-6: <input type="time" id="callTimeA"></legend></div>
                <div style="padding-top: 10px;"><legend>Case Description: <input type="text" id="followADes" placeholder="Here goes the case description"></legend></div>
                <div style="padding-top: 10px;"><button onclick="GenerateSEVAFollowUp()">Generate</button></div>
            </fieldset>
                
            <fieldset id="f1" class="subtab-content">
                <legend>Unresponsive Process</legend>
                <div>
                    <legend>Follow Up Number:</legend>
                    <input type="radio" id="st" name="sNum" value="1" checked>
                    <label for="st">1</label>
                    <input type="radio" id="nd" name="sNum" value="2">
                    <label for="nd">2</label>
                    <input type="radio" id="th" name="sNum" value="3">
                    <label for="th">3</label>
                </div>
                <div><legend>Time of the Call UTC-6: <input type="time" id="callTime"></legend></div>
                <div style="padding-top: 10px;"><legend>Case Description: <input type="text" id="followDes" placeholder="Here goes the case description"></legend></div>
                <div style="padding-top: 10px;"><button onclick="GenerateFollowUp()">Generate</button></div>
            </fieldset>

            <fieldset id="f2" class="subtab-content">
                <legend>Holidays Follow Ups</legend>
                <div id="HDContainer"></div>
                <div style="padding-top: 15px;">
                    <button onclick="GenerateHolydays()">Generate</button>
                </div>
            </fieldset>

            <fieldset id="osp" class="subtab-content active">
                <fieldset id="pendingInfo" style="display: block;">
                    <legend>Pending from customer</legend>
                    <input type="radio" id="pi" name="pnd" value="pi" checked>
                    <label for="pi">Pending Info</label>
                    <input type="radio" id="nd" name="pnd" value="pc">
                    <label for="pc">Pending Confirmation</label>
                </fieldset>
                
                <fieldset>
                    <legend>Follow Up Info</legend>
                    <div id="OSPWarn">
                        <legend>Closure Warning?: <input type="checkbox" id="OSPEnd" onclick="ShowLCADate()"></legend>
                        <div id="dateCont" style="display: none;"><legend style="padding-top: 10px;">Last contact attempt: <input type="date" id="OSPDate"></legend></div>
                    </div>
                    <div id="emLCA" style="display: block;">
                        <div style="padding-top: 10px;"><legend>Case Description: <input type="text" id="OSPDesc" placeholder="Here goes the case description"></legend></div>
                    </div>
                    
                    <div id="phLCA" style="display: none; padding-top: 10px;">
                        <div><legend>Time of the Call UTC-6: <input type="time" id="OSPcallTime"></legend></div>
                        <div style="padding-top: 10px;"><legend>Call Reason: <input type="text" id="callReason"></legend></div>
                    </div>               
                    <div style="padding-top: 10px;"><button onclick="GenerateOSP()">Generate</button></div>
                </fieldset>
                
            </fieldset>

            <fieldset>
                <legend>Template Result</legend>
                <div id="followUp"></div>
            </fieldset>
            <script>
                
                async function GenerateOSP(){
                    const cName = document.getElementById("clientNameF").value;
                    const cNumber = document.getElementById("caseNumF").value;
                    const cDes = document.getElementById("OSPDesc").value;
                    const callR = document.getElementById("callReason").value;
                    const timeReference = document.getElementById("OSPcallTime").value;
                    const OSPclosure = document.getElementById("OSPEnd").checked;
                    const slaType = document.querySelector('input[name="pcm"]:checked').value;
                    const slaLanguage = document.querySelector('input[name="language"]:checked').value;
                    const pendingCX = document.querySelector('input[name="pnd"]:checked').value;
                    const date = getLastContact();
                    day = String(date.getDate()).padStart(2,'0');
                    month = String(date.getMonth() + 1).padStart(2,'0');
                    template = "";

                    if(slaLanguage === "eng"){
                        if(OSPclosure) template = await GetTemplates("CL_ST_ENG");
                        else{
                            if(slaType ==="email"){
                                if(pendingCX === "pi") template = await GetTemplates("OS_PI_EM_ENG");
                                else if(pendingCX === "pc") template = await GetTemplates("OS_PC_EM_ENG");
                            }
                            else if(slaType === "phone") template = await GetTemplates("OS_FU_PH_ENG")
                        }
                    }
                    else if(slaLanguage === "esp"){
                        if(OSPclosure) template = await GetTemplates("CL_ST_ESP");
                        else{
                            if(slaType ==="email"){
                                if(pendingCX === "pi") template = await GetTemplates("OS_PI_EM_ESP");
                                else if(pendingCX === "pc") template = await GetTemplates("OS_PC_EM_ESP");
                            }
                            else if(slaType === "phone") template = await GetTemplates("OS_FU_PH_ESP");
                        }
                    }

                    if(template.includes("NAME")) template = template.replace("NAME",cName);
                    if(template.includes("TIME")) template = template.replace("TIME","<b>" + callTime +" UTC-6</b>");
                    if(template.includes("DATE")) template = template.replace("DATE","<b>" + `${day}/${month}` +"</b>");
                    if(template.includes("REASON")) template = template.replace("REASON","<b>" + callR +"</b>");
                    //if(template.includes("PH")) template = template = template.replace("PH","<b>" + cPhone +"</b>");
                    if(template.includes("TICKET")) template = template.replace("TICKET","<b>" + cNumber + "</b>");
                    if(template.includes("DESC")) template = template.replace("DESC", "<b>" + cDes + "</b>");


                    document.getElementById("followUp").innerHTML = template.replace(/\n/g,"<br>");

                }

                async function GenerateSEVAFollowUp(){
                    const cName = document.getElementById("clientNameF").value;
                    const cNumber = document.getElementById("caseNumF").value;
                    const cPhone = document.getElementById("clientPhoneF").value;
                    const cDes = document.getElementById("followADes").value;
                    const timeReference = document.getElementById("callTimeA").value;
                    const slaLanguage = document.querySelector('input[name="language"]:checked').value;
                    const strikeNum = document.querySelector('input[name="sAnum"]:checked').value;

                    //#region 12 Hours format conversor
                    let [h, min] = timeReference.split(':');
                    let hours = parseInt(h,10);
                    let dayzone = '';
                    if(hours === 0){
                        hours = 12;
                        dayzone = 'am';
                    }
                    else if(hours === 12){
                        dayzone = 'pm';
                    }
                    else if(hours > 12){
                        hours -= 12;
                        dayzone = 'pm';
                    }
                    else{
                        dayzone = 'am';
                    }
                    let callTime = hours+":"+min+dayzone;
                    //#endregion

                    if(slaLanguage === "eng"){
                        if(strikeNum === "1") template = await GetTemplates("FU_SEVA_S1_ENG");
                        else if(strikeNum === "2") template = await GetTemplates("FU_SEVA_S2_ENG");
                        else if(strikeNum === "3") template = await GetTemplates("FU_SEVA_S3_ENG");
                    }
                    else if(slaLanguage === "esp"){
                        if(strikeNum === "1") template = await GetTemplates("FU_SEVA_S1_ESP");
                        else if(strikeNum === "2") template = await GetTemplates("FU_SEVA_S2_ESP");
                        else if(strikeNum === "3") template = await GetTemplates("FU_SEVA_S3_ESP");
                    }

                    if(template.includes("NAME")) template = template.replace("NAME",cName);
                    if(template.includes("TIME")) template = template.replace("TIME","<b>" + callTime +" UTC-6</b>");
                    if(template.includes("PH")) template = template = template.replace("PH","<b>" + cPhone +"</b>");
                    if(template.includes("TICKET")) template = template.replace("TICKET","<b>" + cNumber + "</b>");
                    if(template.includes("DESC")) template = template.replace("DESC", "<b>" + cDes + "</b>");


                    document.getElementById("followUp").innerHTML = template.replace(/\n/g,"<br>");

                }

                async function GenerateHolydays(){
                    const hd = document.querySelector('input[name=FU_HD]:checked').value;
                    const cName = document.getElementById("clientNameF").value;
                    const cNumber = document.getElementById("caseNumF").value;

                    template = await GetTemplates(hd);

                    if(template.includes("NAME")) template = template.replace("NAME",cName);
                    //if(template.includes("CALL")) template = template.replace("CALL","<b>" + callTime +" UTC-6</b>");
                    //if(template.includes("PH")) template = template = template.replace("PH","<b>" + cPhone +"</b>");
                    if(template.includes("TICKET")) template = template.replace("TICKET","<b>" + cNumber + "</b>");
                    //if(template.includes("DESC")) template = template.replace("DESC", "<b>" + cDes + "</b>");

                    document.getElementById("followUp").innerHTML = template.replace(/\n/g,"<br>");
                }

                async function GenerateFollowUp(){
                    const cName = document.getElementById("clientNameF").value;
                    const cNumber = document.getElementById("caseNumF").value;
                    const cPhone = document.getElementById("clientPhoneF").value;
                    const cDes = document.getElementById("followDes").value;
                    const timeReference = document.getElementById("callTime").value;
                    const slaLanguage = document.querySelector('input[name="language"]:checked').value;
                    const strikeNum = document.querySelector('input[name="sNum"]:checked').value;

                    //#region 12 Hours format conversor
                    let [h, min] = timeReference.split(':');
                    let hours = parseInt(h,10);
                    let dayzone = '';
                    if(hours === 0){
                        hours = 12;
                        dayzone = 'am';
                    }
                    else if(hours === 12){
                        dayzone = 'pm';
                    }
                    else if(hours > 12){
                        hours -= 12;
                        dayzone = 'pm';
                    }
                    else{
                        dayzone = 'am';
                    }
                    let callTime = hours+":"+min+dayzone;
                    //#endregion


                    if(slaLanguage === "eng"){
                        if(strikeNum === "1") template = await GetTemplates("FU_S1_ENG");
                        else if(strikeNum === "2") template = await GetTemplates("FU_S2_ENG");
                        else if(strikeNum === "3") template = await GetTemplates("FU_S3_ENG");
                    }
                    else if(slaLanguage === "esp"){
                        if(strikeNum === "1") template = await GetTemplates("FU_S1_ESP");
                        else if(strikeNum === "2") template = await GetTemplates("FU_S2_ESP");
                        else if(strikeNum === "3") template = await GetTemplates("FU_S3_ESP");
                    }

                    if(template.includes("NAME")) template = template.replace("NAME",cName);
                    if(template.includes("CALL")) template = template.replace("CALL","<b>" + callTime +" UTC-6</b>");
                    if(template.includes("PH")) template = template = template.replace("PH","<b>" + cPhone +"</b>");
                    if(template.includes("TICKET")) template = template.replace("TICKET","<b>" + cNumber + "</b>");
                    if(template.includes("DESC")) template = template.replace("DESC", "<b>" + cDes + "</b>");
                    
                    document.getElementById("followUp").innerHTML = template.replace(/\n/g,"<br>");
                }

            </script>
        </div>

        <!--Closure-->
        <div id="tab5" class="tab-content">
            <div>
                <legend style="display: block">Feedback URL</legend>
                <input type="text" id="Feedback" placeholder="Here goes the survey url" style="display: block">
                <legend>Symtom:</legend>
                <textarea id="cSymptom" style="width: 750px; height: 100px;"></textarea><div></div>
                <legend>Cause:</legend>
                <textarea id="cCause" style="width: 750px; height: 100px;"></textarea><div></div>
                <legend>Solution:</legend>
                <textarea id="cSolution" style="width: 750px; height: 100px;"></textarea><div></div>
            </div>

            <div>
                <button id="closure" onclick="GenerateClosure()">Generate Closure</button>
                <script>

                    function selectText() {
                        const element = document.getElementById("closureResult");

                        if (document.body.createTextRange) { // Para IE
                            var range = document.body.createTextRange();
                            range.moveToElementText(element);
                            range.select();
                        } else if (window.getSelection) { // Para navegadores modernos
                            var range = document.createRange();
                            range.selectNodeContents(element);
                            var selection = window.getSelection();
                            selection.removeAllRanges();
                            selection.addRange(range);
                        }
                    }

                    async function GenerateClosure(){
                        const cName = document.getElementById("clientNameF").value;
                        const cNumber = document.getElementById("caseNumF").value;
                        const Survey = document.getElementById("Feedback").value;
                        const cSurvey = `<a href="${Survey}" target="_blank">${Survey}</a>`;
                        const cSympt = document.getElementById("cSymptom").value;
                        const cCause = document.getElementById("cCause").value;
                        const cSolution = document.getElementById("cSolution").value;
                        const cLanguage = document.querySelector('input[name="language"]:checked').value;

                        if(cLanguage === "eng"){
                            if(Survey !== "") template = await GetTemplates("CL_LN_ENG");
                            else template = await GetTemplates("CL_ENG")
                        }
                        else if (cLanguage === "esp")
                        {
                            if(Survey !== "") template = await GetTemplates("CL_LN_ESP");
                            else template = await GetTemplates("CL_ESP")
                        }

                        if(template.includes("NAME")) template = template.replace("NAME",cName);
                        if(template.includes("TICKET")) template = template.replace("TICKET","<b>" + cNumber + "</b>");
                        if(template.includes("LINK")) template = template.replace("LINK",cSurvey);
                        if(template.includes("SYNT")) template = template.replace("SYNT",cSympt);
                        if(template.includes("CAUSE")) template = template.replace("CAUSE",cCause);
                        if(template.includes("SOL")) template = template.replace("SOL",cSolution);

                        document.getElementById("closureResult").innerHTML = template.replace(/\n/g,"<br>")
                    }
                </script>
            </div>
            <fieldset>
                <legend>Generated Template</legend>
                <div class="generated-text" id="closureResult" onkeydown="" onpaste="return false" contenteditable="true"></div>
                <script>
                    let CSctrl = false;
                    let CSe = false;

                    document.getElementById("closureResult").addEventListener("keyup",function(event){
                        if(event.ctrlKey){
                            ctrl=true;
                        }
                        if(event.key === 'c' || event.key === 'C'){
                            event.preventDefault();
                            e = true;
                        }
                    });

                    document.getElementById("closureResult").addEventListener("keydown", function(event) {
                        //const selectedText = window.getSelection().toString();
                        if(event.ctrlKey){
                            ctrl=true;
                        }
                        else{
                            event.preventDefault();
                        }
                        if(event.key === 'c' || event.key === 'C'){                            
                            e = true;
                        }
                        else{
                            event.preventDefault()
                        }

                        if(ctrl && e){

                        }
                    });
                </script>
            </fieldset>
        </div>        

        <!--SAW Request-->
        <div id="tab6" class="tab-content">
            <fieldset>
                <legend>Request Info</legend>
                <div>
                    <legend>Autopilot Device Upload Error</legend>
                    <input id="808" type="radio" name="eType" value="808">
                    <label for="808">808</label>
                    <input id="806" type="radio" name="eType" value="806" checked="true">
                    <label for="806">806</label>
                    <legend>Device/s Serial Number/s(Multiple serials must be separated by comas)</legend>
                    <input id="cSerial" type="text" placeholder="Here goes the device/s serial number/s">
                    <legend>Is CSV file collected?<input id="cCSV" type="checkbox"></legend>
                    <legend>Is proof of ownership collected?<input id="cOwn" type="checkbox"></legend>
                    <legend>Customer Context ID:</legend>
                    <input id="cContext" type="text" placeholder="ASIST365>APPLICATIONS>INTUNE>DATA>CONTEXT ID" style="width: 300pt;">
                    <legend>Default Domain</legend>
                    <input id="cDomain" type="text" placeholder="AKA Initial Domain">
                    <div></div>
                    <button id="req" onclick="CompleteRequest()">Generate Request</button>

                    <script>
                        function CompleteRequest(){
                            const cError = document.querySelector('input[name="eType"]:checked').value;
                            const cSerials = document.getElementById("cSerial").value;
                            const cCSV = document.getElementById("cCSV").checked;
                            const cOwn = document.getElementById("cOwn").checked;
                            const cContext = document.getElementById("cContext").value;
                            const cDomain = document.getElementById("cDomain").value;
                            const cNumber = document.getElementById("caseNumF").value;
                            let dev = cSerials.split('');
                            let serials = [];
                            let temp = [];
                            let fxSerials = "";
                            let lastC = 0;
                            let cDev = 1;

                            for(let i=0;i<dev.length;i++){
                                if(dev[i] === ','){
                                    serials.push(new String(temp.join('')));
                                    temp.length = 0;
                                    cDev++;
                                }else{
                                    temp.push(dev[i]);
                                }
                                
                                if(i === dev.length-1){
                                    serials.push(new String(temp.join('')));
                                    temp.length = 0;
                                }
                            }

                            for(let i=0;i<serials.length;i++){
                                if(i != serials.length-1){
                                    fxSerials += serials[i]+", ";
                                }
                                else{
                                    fxSerials += serials[i];
                                }
                            }

                            if(cSerials === ""){
                                msgTemp = "<b>Add Serial Numbers</b>";
                                noteTemp = "<b>Add Serial Numbers</b>";
                                scope = "<b>Add Serial Numbers</b>";
                            }
                            else{

                                if(cDev > 1){
                                    noteTemp = "<ul>"+
                                    "<li>Serial Numbers: "+fxSerials+"</li>"+
                                    "<li>Is CSV file collected: "+(cCSV ? "Yes" : "No")+"</li>"+
                                    "<li>Is proof of ownership collected: "+(cOwn ? "Yes" : "No")+"</li>"+
                                    "<li>Results of Assist365 search: <b>HERE GOES THE RESULT</b></li>"+
                                    "<li>Customer Context ID: "+cContext+"</li>"+
                                    "<li>Default Domain: "+cDomain+"</li>"+
                                    "<ul>\n\n<b>REMEMBER ADDING CAPTURES OF THE DEVICE SEARCH IN ASSIST365</b>\n\n";

                                    if(cError === "808"){
                                        scope = "<b>Issue:</b>\n"+
                                        "The hardware hash of a device is unable to be uploaded to Intune for the Autopilot enrollment due to error 808, which indicates that the device is registered on another tenant.\n\n"+
                                        "<b>Cause:</b>\n"+
                                        "The error occurs because the device's hardware hash is already associated with a different tenant, preventing it from being uploaded to Intune for the Autopilot enrollment.\n\n"+
                                        "<b>Solution:</b>\n\n"+
                                        "The deregistration process was completed from our end and the device should be able to register to your company.\n\n"+
                                        "<b>Scope Agreement:</b>\n"+
                                        "We will consider the case as resolved and the case ready for closure once the devices "+fxSerials+" are successfully deregistered from the other tenant and you can enroll it to your organization. Alternatively, we will consider this case resolved if we confirm that the problem is caused by a third-party application or is by-design.\n\n";
                                    }
                                    else if(cError === "806"){
                                        scope = "<b>Issue:</b>\n"+
                                        "The hardware hash of a device is unable to be uploaded to Intune for the Autopilot enrollment due to error 806, which indicates that the device is already registered on your tenant.\n\n"+
                                        "<b>Cause:</b>\n"+
                                        "The error occurs because the device's hardware hash is already associated with your tenant, preventing it from being uploaded to Intune for the Autopilot enrollment.\n\n"+
                                        "<b>Solution:</b>\n\n"+
                                        "The deregistration process was completed from our end and the device should be able to register to your company.\n\n"+
                                        "<b>Scope Agreement:</b>\n"+
                                        "We will consider the case as resolved and the case ready for closure once the devices "+fxSerials+" are successfully deregistered from your tenant and you can enroll it to your organization. Alternatively, we will consider this case resolved if we confirm that the problem is caused by a third-party application or is by-design.\n\n";
                                    }
                                }
                                else{
                                    noteTemp = "<ul>"+
                                    "<li>Serial Number: "+fxSerials+"</li>"+
                                    "<li>Is CSV file collected: "+(cCSV ? "Yes" : "No")+"</li>"+
                                    "<li>Is proof of ownership collected: "+(cOwn ? "Yes" : "No")+"</li>"+
                                    "<li>Results of Assist365 search: <b>HERE GOES THE RESULT</b></li>"+
                                    "<li>Customer Context ID: "+cContext+"</li>"+
                                    "<li>Default Domain: "+cDomain+"</li>"+
                                    "<ul>\n\n<b>REMEMBER ADDING CAPTURES OF THE DEVICE SEARCH IN ASSIST365</b>\n\n";

                                    if(cError === "808"){
                                        scope = "<b>Issue:</b>\n"+
                                        "The hardware hash of a device is unable to be uploaded to Intune for the Autopilot enrollment due to error 808, which indicates that the device is registered on another tenant.\n\n"+
                                        "<b>Cause:</b>\n"+
                                        "The error occurs because the device's hardware hash is already associated with a different tenant, preventing it from being uploaded to Intune for the Autopilot enrollment.\n\n"+
                                        "<b>Solution:</b>\n\n"+
                                        "The deregistration process was completed from our end and the device should be able to register to your company.\n\n"+
                                        "<b>Scope Agreement:</b>\n"+
                                        "We will consider the case as resolved and the case ready for closure once the device "+fxSerials+" is successfully deregistered from the other tenant and you can enroll it to your organization. Alternatively, we will consider this case resolved if we confirm that the problem is caused by a third-party application or is by-design.\n\n";
                                    }
                                    else if(cError === "806"){
                                        scope = "<b>Issue:</b>\n"+
                                        "The hardware hash of a device is unable to be uploaded to Intune for the Autopilot enrollment due to error 806, which indicates that the device is already registered on your tenant.\n\n"+
                                        "<b>Cause:</b>\n"+
                                        "The error occurs because the device's hardware hash is already associated with your tenant, preventing it from being uploaded to Intune for the Autopilot enrollment.\n\n"+
                                        "<b>Solution:</b>\n\n"+
                                        "The deregistration process was completed from our end and the device should be able to register to your company.\n\n"+
                                        "<b>Scope Agreement:</b>\n"+
                                        "We will consider the case as resolved and the case ready for closure once the device "+fxSerials+" is successfully deregistered from your tenant and you can enroll it to your organization. Alternatively, we will consider this case resolved if we confirm that the problem is caused by a third-party application or is by-design.\n\n";
                                    }
                                }

                                msgTemp = "Hello Team,\n\n"+
                                "I have the following case ready to submit as a SAW request (Autopilot deregistration)\n\n"+
                                "<b>"+cNumber+"</b>\n\n"+
                                "Number of devices: "+cDev+"\n\n"+
                                "Form is filled and notes complete.";
                            }                            

                            document.getElementById("scope").innerHTML = scope.replace(/\n/g,"<br>");
                            document.getElementById("note").innerHTML = noteTemp.replace(/\n/g,"<br>");
                            document.getElementById("msg").innerHTML = msgTemp.replace(/\n/g,"<br>");
                        }
                    </script>
                </div>
            </fieldset>        
            <fieldset>
                <legend>Scope Agreement</legend>
                <div id="scope" contenteditable="false" style="border: 1px solid #ccc; padding: 10px;"></div>
            </fieldset>
            <fieldset>
                <legend>Note Prompt</legend>
                <div id="note" contenteditable="false" style="border: 1px solid #ccc; padding: 10px;"></div>
            </fieldset>
            <fieldset>
                <legend>Group Message Prompt</legend>
                <div id="msg" contenteditable="false" style="border: 1px solid #ccc; padding: 10px;"></div>
            </fieldset>
        </div>

        <!--22 Days Note-->
        <div id="tab7" class="tab-content">
            <fieldset>
                <legend><b>Case information</b></legend>
                <div>
                    Scope Agreement:<div></div>
                    <textarea id="cScope" style="width: 400px; height: 150px;"></textarea><div></div>
                    Business Impact:<div></div>
                    <textarea id="cImpact" style="width: 400px; height: 150px;"></textarea><div></div>
                    Observed Behavior:<div></div>
                    <textarea id="cBehavior" style="width: 400px; height: 150px;"></textarea><div></div>
                    Action Plan:<div></div>
                    <textarea id="cAction" style="width: 400px; height: 150px;"></textarea>
                </div>
                <button onclick="OldCaseDaysNote()">Generate</button>
            </fieldset>
            <fieldset>
                <div id="22days" contenteditable="false" style="border: 1px solid #ccc; padding: 10px;"></div>                
            </fieldset>
            <script>
                function OldCaseDaysNote(){
                    let scope = document.getElementById("cScope").value;
                    let impact = document.getElementById("cImpact").value;
                    let behavior = document.getElementById("cBehavior").value;
                    let action = document.getElementById("cAction").value;


                    template = "<b>Case Summary Note</b>\n"+
                    "<ul>"+
                        "<li>Case Number:</li>"+
                            "<ul><li>"+cNumber.value+"</li></ul>"+
                        "<li>Scope Agreement:</li>"+
                            "<ul><li>"+scope+"</li></ul>"+
                        "<li>Business Impact:</li>"+
                            "<ul><li>"+impact+"</li></ul>"+
                        "<li>Observed Behavior:</li>"+
                            "<ul><li>"+behavior+"</li></ul>"+
                        "<li>Relevant Screenshots:\n <b>REMEMBER INSERTING YOUR SCREENSHOTS</b></li>"+
                        "<li>Action Plan:</li>"+
                            "<ul><li>"+action+"</li></ul>"+
                    "</ul>";

                    document.getElementById("22days").innerHTML = template.replace(/\n/g,"<br>");
                }
            </script>

        </div>

        <!--IET-->
        <div id="tab8" class="tab-content">
            <div>
                <b>IET TEMPLATE | ASSISTANCE REQUEST | </b><input type="text" id="ietTitle" placeholder="Case Title">
            </div>
            <fieldset>
                <legend>Basic Information</legend>
                <div>
                    <b>Title:</b><input type="text" id="compName" placeholder="Company Name"><b> - </b><input type="text" id="ietDesc" placeholder="One line description">
                </div>
                <div>
                    <b>TA | TL Engaged:</b><input type="text" id="TA" placeholder="TA NAME / TA v-"><b> | </b><input type="text" id="TL" placeholder="TL NAME / TL v-">
                </div>
                <div>
                    <b>Assistance Required:</b><input type="radio" name="aRequested" value="ICM" checked="true" id="i"><label for="i">ICM</label><input type="radio" name="aRequested" value="RFC" id="r"><label for="r">RFC</label><input type="radio" name="aRequested" value="DCR" id="d"><label for="d">DCR</label>
                    <input type="text" id="assistance" placeholder="What needs to be fixed?">
                </div>
                <div>
                    <b>Date Issue Started:</b><input type="text" id="iDate" placeholder="Here goes the date">
                </div>
                <div>
                    <b>Default Domain name:</b><input type="text" id="dDomain" placeholder="DEFAULT DOMAIN AKA INITIAL DOMAIN">
                </div>
                <div>
                    <b>Company ID:</b><input type="text" id="tID" placeholder="COMPANY ID AKA TENANT ID">
                </div>
                <div>
                    <b>MDM Authority:</b><input type="text" id="MDM" placeholder="ASSIST365>APPLICATIONS>INTUNE>TENANT OVERVIEW">
                </div>
                <div>
                    <b>ASU:</b><input type="text" id="ASU" placeholder="ASSIST365>APPLICATIONS>INTUNE>TENANT OVERVIEW">
                </div>
            </fieldset>

            <fieldset>
                <legend><b>Issue Details</b></legend>
                <div>
                    <b>Issue Summary:<br></b>
                    <textarea id="iSum" style="height: 100px; width: 600px;"></textarea><br>
                    <b>Impact:<br></b>
                    <textarea id="imp" style="height: 100px; width: 600px;"></textarea><br>
                    <b>Approx. affected user count:</b><input type="text" id="usrCount"><br>
                    <b>Is this a POC (proof of concept):</b><input type="checkbox" id="POC"><br>
                    <b>Is this blocking users from working:</b><input type="checkbox" id="avoidWork" onclick="ShowAvoidWorkARG()"><br>
                    <b id="argHeader" style="display: none;">Why avoids Work:</b>
                    <textarea id="avoidARG" style="height: 100px; width: 600px; display: none;"></textarea>
                    <b>Will this issue cause delay on customer project(s) if not resolved quickly:</b><input type="checkbox" id="cusDelay" onclick="ShowDeadline()">
                    <div id="dl" style="display: none;">
                        <b>Customer deadline:</b><input type="text" id="deadline" placeholder="Customer deadline">
                    </div><br id="si">
                    <b>Anything else that should be known on Impact:</b><br>
                    <textarea id="addImpc" style="height: 100px; width: 600px;"></textarea>
                </div>
                <script>
                    function ShowAvoidWorkARG(){
                        let avoidW = document.getElementById("avoidWork").checked;
                        let avoidARG = document.getElementById("avoidARG");
                        let argH = document.getElementById("argHeader");

                        if(avoidW) {
                            avoidARG.style.display = "block";
                            argH.style.display = "block";
                        }
                        else {
                            avoidARG.style.display = "none";
                            argH.style.display = "none";
                        }
                    }

                    function ShowDeadline(){
                        let isDelaying = document.getElementById("cusDelay").checked;
                        let deadline = document.getElementById("dl");
                        let si = document.getElementById("si");

                        if(isDelaying){
                            deadline.style.display = "block";
                            si.style.display = "none";
                        }
                        else {
                            deadline.style.display = "none";
                            si.style.display = "block";
                        }
                    }
                </script>
            </fieldset>

            <fieldset>
                <legend><b>Behavior Details</b></legend>
                <div>
                    <b>Expected Behavior:</b><br>
                    <textarea id="eBh" style="height: 100px; width: 600px;"></textarea><br>
                    <b>Article Referenced for Expected Behavior:</b><input type="text" id="artBH"><br>
                    <b>Observed Behavior:</b><br>
                    <textarea id="oBh" style="height: 100px; width: 600px;"></textarea><br>
                </div>
            </fieldset>

            <fieldset>
                <legend><b>Affected Users/Devices/Policies</b></legend>
                <div>
                    <b>Are users affected?</b><input type="checkbox" id="usr" onclick="ShowUsers()"><br>
                    <div id="aUSR" style="display: none;">
                        <div id="usersInfo"></div>
                        <button id="addUsrBnt" onclick="AddUserInfo()">Add User</button>
                        <button id="removeUsrBnt" onclick="RemoveUserInfo()">Remove User</button>
                    </div>
                    <b>Are devices affected?</b><input type="checkbox" id="dvs" onclick="ShowDevices()"><br>
                    <div id="aDVS" style="display: none;">
                        <div id="dInfo"></div>
                        <button id="addDevBnt" onclick="AddDeviceInfo()">Add Device</button>
                        <button id="removeDevBnt" onclick="RemoveDeviceInfo()">Remove Device</button>
                    </div>
                    <b>Are policies affected</b><input type="checkbox" id="pl" onclick="ShowPolicies()"><br>
                    <div id="aPL" style="display: none;">
                        <div id="plInfo"></div>
                        <button id="addPlBnt" onclick="AddPolicyInfo()">Add Policy</button>
                        <button id="removeDevBnt" onclick="RemovePolicyInfo()">Remove Policy</button>
                    </div>
                </div>

                <script>
                    let users = 0;
                    let devices = 0;
                    let policies = 0;
                    let usrs = [];

                    function ShowDevices(){
                        const cDVS = document.getElementById("dvs").checked;

                        if(cDVS === true){
                            aDVS.style.display = "block";
                            if(devices === 0) AddDeviceInfo();
                        }
                        else aDVS.style.display = "none";
                    }

                    function ShowPolicies(){
                        const cPL = document.getElementById("pl").checked;
                        
                        if(cPL === true){
                            aPL.style.display = "block";
                            if(policies === 0) AddPolicyInfo();
                        }
                        else aPL.style.display = "none";
                    }

                    function ShowUsers(){
                        const cUSR = document.getElementById("usr").checked;
                    
                        if(cUSR === true) {
                            aUSR.style.display = "block";
                            if(users === 0) AddUserInfo();
                        }
                        else {
                            aUSR.style.display = "none";
                            RemoveUserInfo(true);
                        }
                    }
                    
                    function AddUserInfo(){
                        
                        if(users < 3){
                            let ndiv = document.createElement("fieldset");
                            ndiv.id = "user"+(users+1);
                            let lng = document.createElement("legend");
                            lng.innerHTML = "<b>User "+(users+1)+":</b>";
                            ndiv.appendChild(lng);

                            let upn = document.createElement("b");
                            upn.innerHTML = 'UPN: ';
                            let upnT = document.createElement("input");
                            upnT.type = "text";
                            upnT.id = "upn"+(users+1);
                            upnT.placeholder = "User UPN";
                            ndiv.appendChild(upn);
                            ndiv.appendChild(upnT);
                            ndiv.appendChild(document.createElement("br"));

                            let usrID = document.createElement("b");
                            usrID.innerHTML = 'User ID: ';
                            let usrIDT = document.createElement("input");
                            usrIDT.type = "text";
                            usrIDT.id = "userID"+(users+1);
                            usrIDT.placeholder = "Intune User ID";
                            ndiv.appendChild(usrID);
                            ndiv.appendChild(usrIDT);
                            ndiv.appendChild(document.createElement("br"));

                            let lic = document.createElement("b");
                            lic.innerHTML = 'Intune Licenced?';
                            let licC = document.createElement("input");
                            licC.type = "checkbox";
                            licC.id = "intuneLic"+(users+1);
                            ndiv.appendChild(lic);
                            ndiv.appendChild(licC);
                            usersInfo.appendChild(ndiv);

                            users++;
                            usrs.push(ndiv);
                            
                            if(users === 3){
                                document.getElementById("addUsrBnt").disabled = true;
                            }
                        }
                    }
                
                    function AddDeviceInfo(){
                        var platforms = ["Windows","Android","iOS/iPadOS","MacOS","Linux"];

                        if(devices < 3){
                            let ndiv = document.createElement("fieldset");
                            ndiv.id = "device"+(devices+1);
                            let lng = document.createElement("legend");
                            lng.innerHTML = "<b>Device "+ (devices+1) +"</b>";
                            ndiv.appendChild(lng);

                            let devID = document.createElement("b");
                            devID.innerHTML = "Intune Device ID: ";
                            let devIDT = document.createElement("input");
                            devIDT.type = "text";
                            devIDT.id = "devID"+(devices+1);
                            devIDT.placeholder = "Intune Device ID";
                            ndiv.appendChild(devID);
                            ndiv.appendChild(devIDT);
                            ndiv.appendChild(document.createElement("br"));

                            let aadD = document.createElement("b");
                            aadD.innerHTML = "AAD Device ID: ";
                            let aadDT = document.createElement("input");
                            aadDT.type = "text";
                            aadDT.id = "aadDevID"+(devices+1);
                            aadDT.placeholder = "AAD Device ID";
                            ndiv.appendChild(aadD);
                            ndiv.appendChild(aadDT);
                            ndiv.appendChild(document.createElement("br"));

                            let aao = document.createElement("b");
                            aao.innerHTML = "AAD Object ID: ";
                            let aaoT = document.createElement("input");
                            aaoT.type = "text";
                            aaoT.id = "aadObjID"+(devices+1);
                            aaoT.placeholder = "AAD Object ID";
                            ndiv.appendChild(aao);
                            ndiv.appendChild(aaoT);
                            ndiv.appendChild(document.createElement("br"));

                            let dn = document.createElement("b");
                            dn.innerHTML = "Device Name: ";
                            let dnT = document.createElement("input");
                            dnT.type = "text";
                            dnT.id = "devName"+(devices+1);
                            dnT.placeholder = "Device Name";
                            ndiv.appendChild(dn);
                            ndiv.appendChild(dnT);
                            ndiv.appendChild(document.createElement("br"));

                            let sn = document.createElement("b");
                            sn.innerHTML = "Serial Number: ";
                            let snT = document.createElement("input");
                            snT.type = "text";
                            snT.id = "serNum"+(devices+1);
                            snT.placeholder = "Serial Number";
                            ndiv.appendChild(sn);
                            ndiv.appendChild(snT);
                            ndiv.appendChild(document.createElement("br"));

                            let os = document.createElement("b");
                            os.innerHTML = "Platform";
                            let sd = document.createElement("div");
                            sd.id = "SKU"+(devices+1);
                            let plt = document.createElement("select");
                            plt.id = "devOS"+(devices+1);
                            for(i=0;i<platforms.length;i++){
                                o = document.createElement("option");
                                o.value = platforms[i];
                                o.text = platforms[i];
                                plt.appendChild(o);
                            }
                            plt.addEventListener("change", function (){
                                platform = plt;
                                let sku = sd;

                                if(platform.value === "Windows"){
                                    sku.style.display = "block";
                                }
                                else{
                                    sku.style.display = "none";
                                }
                            });
                            ndiv.appendChild(os);
                            ndiv.appendChild(plt);
                            ndiv.appendChild(document.createElement("br"));

                            let m = document.createElement("b");
                            m.innerHTML = "Model: ";
                            let mod = document.createElement("input");
                            mod.type = "text";
                            mod.id = "devModel"+(devices+1);
                            mod.placeholder = "Device Model";
                            ndiv.appendChild(m);
                            ndiv.appendChild(mod);
                            ndiv.appendChild(document.createElement("br"));

                            let ver = document.createElement("b");
                            ver.innerHTML = "OS Version Number: ";
                            let verT = document.createElement("input");
                            verT.type = "text";
                            verT.id = "OSver"+(devices+1);
                            verT.placeholder = "OS Version Number";
                            ndiv.appendChild(ver);
                            ndiv.appendChild(verT);
                            ndiv.appendChild(document.createElement("br"));

                            let sk = document.createElement("b");
                            sk.innerHTML = "SKU: ";
                            let sku = document.createElement("input");
                            sku.type = "text";
                            sku.id = "devSKU"+(devices+1);
                            sd.appendChild(sk);
                            sd.appendChild(sku);
                            ndiv.appendChild(sd);
                            ndiv.appendChild(document.createElement("br"));

                            let e = document.createElement("b");
                            e.innerHTML = "Enrollment Method: ";
                            let enr = document.createElement("input");
                            enr.type = "text";
                            enr.id = "enrMethod"+(devices+1);
                            enr.placeholder = "Enrollment Method";
                            ndiv.appendChild(e);
                            ndiv.appendChild(enr);
                            ndiv.appendChild(document.createElement("br"));

                            let r = document.createElement("b");
                            r.innerHTML = "Reference Intune: ";
                            let ref = document.createElement("select");
                            ref.id = "A365ref"+(devices+1);

                            let ad = document.createElement("b");
                            ad.innerHTML = "Additional Information";
                            let add = document.createElement("textarea");
                            add.id = "addInfo"+(devices+1);
                            add.style.width = "300px";
                            add.style.height = "100px";
                            ndiv.appendChild(ad);
                            ndiv.appendChild(document.createElement("br"));
                            ndiv.appendChild(add);
                            ndiv.appendChild(document.createElement("br"));

                            let c = document.createElement("b");
                            c.innerHTML = "CP Incident ID";
                            let cp = document.createElement("input");
                            cp.type = "text";
                            cp.id = "CP"+(devices+1);
                            cp.placeholder = "Company Portal Incident ID";
                            ndiv.appendChild(c);
                            ndiv.appendChild(cp);
                            ndiv.appendChild(document.createElement("br"));

                            dInfo.appendChild(ndiv);

                            devices++;

                            if(devices === 3){
                                document.getElementById("addDevBnt").disabled = true;
                            }
                        }
                    }
                
                    function AddPolicyInfo(){

                        if(policies < 3){
                            let ndiv = document.createElement("fieldset");
                            ndiv.id = "policy"+(policies+1);
                            let lg = document.createElement("legend");
                            lg.innerHTML = "<b>Policy "+(policies+1)+"</b>";
                            ndiv.appendChild(lg);

                            let typ = document.createElement("b");
                            typ.innerHTML = "Policy Type: ";
                            let ty = document.createElement("input");
                            ty.type = "text";
                            ty.id = "polType"+(policies+1);
                            ty.placeholder = "Policy Type";
                            ndiv.appendChild(typ);
                            ndiv.appendChild(ty);
                            ndiv.appendChild(document.createElement("br"));

                            let nm = document.createElement("b");
                            nm.innerHTML = "Policy Name: ";
                            let n = document.createElement("input");
                            n.type = "text";
                            n.id = "polName"+(policies+1);
                            n.placeholder = "Policy Name";
                            ndiv.appendChild(nm);
                            ndiv.appendChild(n);
                            ndiv.appendChild(document.createElement("br"));

                            let id = document.createElement("b");
                            id.innerHTML = "Policy ID: ";
                            let i = document.createElement("input");
                            i.type = "text";
                            i.id = "polID"+(policies+1);
                            i.placeholder = "Policy ID";
                            ndiv.appendChild(id);
                            ndiv.appendChild(i);
                            ndiv.appendChild(document.createElement("br"));

                            let tg = document.createElement("b");
                            tg.innerHTML = "Targeted group: ";
                            let g = document.createElement("input");
                            g.type = "text";
                            g.id = "targetG"+(policies+1);
                            g.placeholder = "Targeted Group Name";
                            ndiv.appendChild(tg);
                            ndiv.appendChild(g);
                            ndiv.appendChild(document.createElement("br"));

                            let gID = document.createElement("b");
                            gID.innerHTML = "Group ID: ";
                            let gI = document.createElement("input");
                            gI.type = "text";
                            gI.id = "gID"+(policies+1);
                            gI.placeholder = "Group ID";
                            ndiv.appendChild(gID);
                            ndiv.appendChild(gI);
                            ndiv.appendChild(document.createElement("br"));

                            let gTy = document.createElement("b");
                            gTy.innerHTML = "Group Type: ";
                            let gT = document.createElement("input");
                            gT.type = "text";
                            gT.id = "gType"+(policies+1);
                            gT.placeholder = "Group Type";
                            ndiv.appendChild(gTy);
                            ndiv.appendChild(gT);
                            ndiv.appendChild(document.createElement("br"));

                            policies++;
                            plInfo.appendChild(ndiv);
                        }
                    }
                
                    function RemoveUserInfo(bypass = false){
                        if(bypass){
                            document.getElementById("user"+(users)).remove();
                            users--;
                        }
                        else{
                            if(users > 1){
                                document.getElementById("user"+(users)).remove();
                                users--;
                            }
                        }
                    }

                    function RemoveDeviceInfo(bypass = false){
                        if(bypass){
                            document.getElementById("device"+devices).remove();
                            devices--;
                        }
                        else{
                            if(devices > 1){
                                document.getElementById("device"+devices).remove();
                                devices--;
                            }
                        }
                    }

                    function RemovePolicyInfo(bypass = false){
                        if(bypass){
                            document.getElementById("policy"+policies).remove();
                            policies--;
                        }
                        else{
                            if(policies > 1){
                                document.getElementById("policy"+policies).remove();
                                policies--;
                            }
                        }
                    }
                </script>
            </fieldset>

            <fieldset>
                <legend><b>Troubleshooting</b></legend>
            </fieldset>

            <fieldset>
                <legend><b>Reproduction Details</b></legend>
                <b>Repro Steps:</b><br>
                <textarea id="steps" style="height: 100px; width: 600px;"></textarea><br>
                <b>Needed configurations and steps to attempt to repro:</b><br>
                <textarea id="configs" style="height: 100px; width: 600px;"></textarea><br>
                <b>Are you able to reproduce the issue in a test tenant using the above configurations/steps?</b>
                <input type="checkbox" id="ableToRepro"><br>
                <b>How your repro results were different:</b><br>
                <textarea id="reproDiff" style="height: 100px; width: 600px;"></textarea><br>
                <b>Why you could not attempt repro:</b><br>
                <textarea id="notAttempt" style="height: 100px; width: 600px;"></textarea><br>
            </fieldset>
            <fieldset>
                <legend><b>Additional data/logs:</b></legend>
                <textarea id="addInfo" style="height: 100px; width: 600px;"></textarea>
            </fieldset>
            <button onclick="GenerateIET()">Generate</button>
            <script>
                
                let us = "";
                let dev = "";
                let pol = "";
                
                function GenerateIET(){

                    //#region 
                    const ietTitle = document.getElementById("ietTitle").value;
                    const compName = document.getElementById("compName").value;
                    const ietDesc = document.getElementById("ietDesc").value;
                    const TA = document.getElementById("TA").value;
                    const TL = document.getElementById("TL").value;
                    const request = document.querySelector('input[name="aRequested"]:checked').value;
                    const requestDesc = document.getElementById("assistance").value;
                    const date = document.getElementById("iDate").value;
                    const dom = document.getElementById("dDomain").value;
                    const compID = document.getElementById("tID").value;
                    const mdm = document.getElementById("MDM").value;
                    const asu = document.getElementById("ASU").value;
                    const ism = document.getElementById("iSum").value;
                    const imp = document.getElementById("imp").value;
                    const usrCount = document.getElementById("usrCount").value;
                    const poc = document.getElementById("POC").checked;
                    const avoidWrk = document.getElementById("avoidWork").checked;
                    const avoidARG = document.getElementById("avoidARG").value;
                    const cusDelay = document.getElementById("cusDelay").checked;
                    const deadline = document.getElementById("deadline").value;
                    const addImpc = document.getElementById("addImpc").value;
                    const expBh = document.getElementById("eBh").value;
                    const obsBh = document.getElementById("oBh").value;
                    const artBh = document.getElementById("artBH").value;
                    const steps = document.getElementById("steps").value;
                    const configs = document.getElementById("configs").value;
                    const ableRepro = document.getElementById("ableToRepro").checked;
                    const reproDiff = document.getElementById("reproDiff").value;
                    const notAttempt = document.getElementById("notAttempt").value;
                    //#endregion

                    if(users >= 1){
                        us = "";
                        for(let i=0;i<users;i++){
                            us += "<b>UPN:</b> "+document.getElementById("upn"+(i+1)).value +"\n"+
                            "<b>UserID:</b> "+ document.getElementById("userID"+(i+1)).value +"\n"+
                            "<b>Intune Licensed:</b> "+ (document.getElementById("intuneLic"+(i+1)).checked ? "Yes" : "No")+"\n\n";
                        }
                        us += "<b>===============</b>\n\n";
                        //console.log(usrsInfo);
                    }

                    if(devices >= 1){
                        dev = "";
                        for(let i=0;i<devices;i++){
                            dev += "<b>Intune Device ID:</b> "+document.getElementById("devID"+(i+1)).value+"\n"+
                            "<b>AAD Device ID:</b> "+document.getElementById("aadDevID"+(i+1)).value+"\n"+
                            "<b>AAD Object ID:</b> "+document.getElementById("aadObjID"+(i+1)).value+"\n"+
                            "<b>Device Name:</b> "+document.getElementById("devName"+(i+1)).value+"\n"+
                            "<b>Serial Number:</b> "+document.getElementById("serNum"+(i+1)).value+"\n"+
                            "<b>Platform:</b> "+document.getElementById("devOS"+(i+1)).value+"\n"+
                            "<b>Model and OS Version Number</b> "+document.getElementById("devModel"+(i+1)).value+" / " +document.getElementById("OSver"+(i+1)).value + 
                            (document.getElementById("devModel"+(i+1)).value === "Windows" ? " / "+document.getElementById("devSKU"+(i+1)).value+"\n" : "\n")+
                            "<b>Enrollment Method:</b> "+document.getElementById("enrMethod"+(i+1)).value+"\n"+
                            "<b>Additional Information:</b> "+document.getElementById("addInfo"+(i+1)).value+"\n"+
                            "<b>CP log incident ID:</b> "+document.getElementById("CP"+(i+1)).value+"\n\n";
                        }
                        dev += "<b>===============</b>\n\n";
                        //console.log(devInfo);
                    }

                    if(policies >= 1){
                        pol = "";
                        for(let i=0;i<policies;i++){
                            pol += "<b>Policy Type:</b>"+document.getElementById("polType"+(i+1)).value+"\n"+
                            "<b>Policy Name:</b> "+document.getElementById("polName"+(i+1)).value+"\n"+
                            "<b>Policy ID:</b> "+document.getElementById("polID"+(i+1)).value+"\n"+
                            "<b>Targeted Group/ID/Type:</b> "+document.getElementById("targetG"+(i+1)).value +" / "+document.getElementById("gID"+(i+1)).value +" / "+document.getElementById("gType"+(i+1)).value + "\n\n";
                        }
                        pol += "<b>===============</b>\n\n";
                        //console.log(polInfo);
                    }
                
                
                    iet = "IET TEMPLATE | ASSISTANCE REQUEST | "+ ietTitle +"\n\n"+
                    "<b>Title:</b> "+compName+" - "+ietDesc+"\n"+
                    "<b>Case#:</b> "+document.getElementById("caseNumF").value + "\n"+
                    "<b>TA|TL Engaged:</b> "+ TA +(TL != "" ? "" : (" | "+TL))+"\n"+
                    "<b>Assistance Required:</b> "+request+", "+requestDesc+"\n"+
                    "<b>Date Issue Started:</b> "+date+"\n"+
                    "<b>Default Domain Name:</b> "+dom+"\n"+
                    "<b>Company ID:</b> "+compID+"\n"+
                    "<b>MDM Authority:</b> "+mdm+"\n"+
                    "<b>ASU:</b> "+asu+"\n"+
                    "<b>===============</b>\n\n"+
                    "<b>Issue Summary:</b>\n"+ism+"\n\n"+
                    "<b>Impact:</b>\n"+imp+"\n\n"+
                    "<b>Approx. affected user count:</b> "+usrCount+"\n"+
                    "<b>Is this a POC (proof of concept):</b> "+(poc ? "Yes":"No")+"\n"+
                    "<b>Ist this blocking users from working:</b> "+(avoidWrk ? "Yes" : "No")+(avoidWrk ? ", "+avoidARG : "")+"\n"+
                    "<b>Will this issue cause daly on customer project(s) if not resolved quickly:</b> "+(cusDelay ? "Yes" : "No")+(cusDelay ? ", <b>needed fix deadline:</b> "+deadline : "")+"\n"+
                    "<b>Anything else that should be known on Impact:</b>"+(addImpc != "" ? "\n"+addImpc : " N/A") + "\n\n"+
                    "<b>Expected Behavior:</b> "+expBh+"\n"+
                    "<b>Article Reference for Expected Behavior:</b> "+artBh+"\n"+
                    "<b>Observed Behavior:</b> "+obsBh+"\n"+
                    "<b>===============</b>\n\n"+
                    us+dev+pol;

                
                    document.getElementById("ietRes").innerHTML = iet.replace(/\n/g,"<br>");
                }

            </script>
            <fieldset>
                <legend><b>IET</b></legend>
                <div id="ietRes"></div>
            </fieldset>
        </div>

        <script>

            const subButtons = document.querySelectorAll('.subtab-btn');
            const subContents = document.querySelectorAll('.subtab-content');
            const buttons = document.querySelectorAll('.tab-btn');
            const contents = document.querySelectorAll('.tab-content');

            subButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Quitar clase activa de todos
                    subButtons.forEach(btn => btn.classList.remove('active'));
                    subContents.forEach(content => content.classList.remove('active'));

                    // Activar el seleccionado
                    button.classList.add('active');
                    document.getElementById(button.dataset.tab).classList.add('active');
                });
            });

            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    // Quitar clase activa de todos
                    buttons.forEach(btn => btn.classList.remove('active'));
                    contents.forEach(content => content.classList.remove('active'));

                    // Activar el seleccionado
                    button.classList.add('active');
                    document.getElementById(button.dataset.tab).classList.add('active');
                });
            });
        </script>
    </body>
</html>