export function sendMail(mail: string, subject: string, contnet: string): void {

    window.open(`mailto:${mail}?subject=${subject} ${contnet}`);

}

export function sendInvitation(emailAddress: string, battleAdress: string) {
    const newLine = "\n\r";
    const invitationAddress = window.location.href.split("#")[0] + "#" + battleAdress;
    sendMail(emailAddress, "A new battle invitation",
        "Hello! " + newLine +
        "You have  received a new invitation for a battle" + newLine +
        "clich here:" + newLine +
        invitationAddress
    );

}