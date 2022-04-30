const postDataAsync = async (location: string, data: any):Promise<Response> => {    
    const res = await fetch(location, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return res;
};

export { postDataAsync };
