import { createServer } from "http";
import { Server } from "socket.io";
import Client, { Socket as ClientSocket } from "socket.io-client";
import { server, io } from "./server";
import { AddressInfo } from "net";

describe("Chat API PoC", () => {
    let clientSocket: ClientSocket;
    let clientSocket2: ClientSocket;

    beforeAll((done) => {
        // Server is already running from the import, but we need to know the port
        const port = (server.address() as AddressInfo).port;
        const url = `http://localhost:${port}`;

        clientSocket = Client(url);
        clientSocket2 = Client(url);

        clientSocket.on("connect", done);
    });

    afterAll(() => {
        io.close();
        clientSocket.close();
        clientSocket2.close();
        server.close();
    });

    test("should allow a user to join", (done) => {
        clientSocket.emit("join", "User1");

        // We expect a message back saying User1 joined
        clientSocket.on("message", (msg) => {
            if (msg.text === "User1 has joined the chat.") {
                done();
            }
        });
    });

    test("should broadcast messages to other users", (done) => {
        // Ensure client2 is connected and joined
        clientSocket2.emit("join", "User2");

        // Listen for message on client2
        clientSocket2.on("message", (msg) => {
            // Ignore join messages
            if (msg.text.includes("joined the chat")) return;

            try {
                expect(msg.user).toBe("User1");
                expect(msg.text).toBe("Hello World");
                done();
            } catch (error) {
                done(error);
            }
        });

        // Send message from client1
        // We need to make sure client1 has joined first (which it did in the previous test, 
        // but let's emit join again just in case or rely on state)
        // In this simple PoC, state is kept.
        clientSocket.emit("message", "Hello World");
    });
});
