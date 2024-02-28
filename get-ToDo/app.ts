import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

import pg from 'pg';

const pool = new pg.Client({
    user: 'postgres',
    password: 'DATABASE-123',
    host: 'database-1.cbqci0e82lsc.eu-north-1.rds.amazonaws.com',
    port: 5432,
    database: 'perntodo',
    ssl: {
        rejectUnauthorized: false,
    },
});

//read all todo
export const getTodo = async () => {
    try {
        await pool.connect();

        const result = await pool.query(`SELECT * FROM todo`);
        const todos = result.rows;

        return {
            statusCode: 200,
            body: JSON.stringify(todos),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify('Internal Server Error'),
        };
    }
};

//read todo by id
export const getTodoById = async (event: any) => {
    const todoId = event.pathParameters.id;
    try {
        await pool.connect();

        const result = await pool.query(`SELECT * FROM todo where id= ${todoId}`);
        const todos = result.rows;

        return {
            statusCode: 200,
            body: JSON.stringify(todos),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify('Internal Server Error'),
        };
    }
};

//insert todo
export const insertTodo = async (event: any) => {
    const body = event.body ? JSON.parse(event.body) : null;

    try {
        await pool.connect();

        const result = await pool.query(`INSERT INTO todo(description) VALUES('${body.descr}')`);

        return {
            statusCode: 200,
            body: JSON.stringify({ 'message: ': 'success', body: result }),
            // body: JSON.stringify('body: ' + event),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify('Internal Server Error'),
        };
    }
};

//delete todo
export const deleteTodo = async (event: any) => {
    const todoId = event.pathParameters.id;

    try {
        await pool.connect();

        const result = await pool.query(`DELETE FROM todo WHERE id=${todoId}`);

        return {
            statusCode: 200,
            body: JSON.stringify({ body: result, 'message: ': 'Successfully deleted' }),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify('Internal Server Error'),
        };
    }
};

//update todo
export const updateTodoById = async (event: any) => {
    const todoId = event.pathParameters.id;
    const body = event.body ? JSON.parse(event.body) : null;

    try {
        await pool.connect();

        const result = await pool.query(`UPDATE todo SET description = '${body.descr}' WHERE id=${todoId}`);

        return {
            statusCode: 200,
            body: JSON.stringify({ body: result.rows, 'message: ': 'Successfully updated' }),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify('Internal Server Error'),
        };
    }
};
