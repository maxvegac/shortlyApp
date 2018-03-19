import {Router} from 'express';
import {models, sequelize} from "../sequelize";
import * as path from "path";
import * as firebase from 'firebase-admin'

export const index = Router();

index.get('/', async (req, res, next) => {
    res.sendFile(path.join(__dirname, '../../angular/dist/index.html'));
});
index.post('/user', async (req, res, next) => {
        try {
            firebase.auth().getUser(req.body.token).then((userRecord) => {
                if (userRecord) {
                    const IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    models.User.find({
                        where: {
                            token: req.body.token
                        }
                    }).then(User => {
                        if (User) {
                            res.status(400).json({
                                'status': 0,
                                'statusCode': 'user/not-created',
                                'error': 'User already exists!'
                            });
                            res.end();
                        } else {
                            models.User.create({
                                token: req.body.token,
                                displayName: req.body.displayName
                            }).then(User => {
                                if (User) {
                                    res.json({
                                        'status': 1,
                                        'statusCode': 'user/created'
                                    });
                                    // Let's find all the urls created with the user IP to associate.
                                    models.URL.findAll({
                                        where: {
                                            creationIP: IP
                                        }
                                    }).then(URLs => {
                                        URLs.forEach(URL => {
                                            User.addUrl(URL);
                                        })
                                    });
                                    res.end();
                                } else {
                                    res.status(400).json({
                                        'status': 0,
                                        'statusCode': 'user/not-created',
                                        'error': 'User already exists!'
                                    });
                                    res.end();
                                }
                            })
                        }
                    });

                } else {
                    res.status(400).json({
                        'status': 0,
                        'statusCode': 'user/not-logged',
                        'error': 'You need to be logged in!'
                    });
                    res.end();
                }
            });
        }
        catch
            (e) {
            next(e);
        }
    }
)
;
index.get('/user/urls', async (req, res, next) => {
    try {
        firebase.auth().getUser(req.query.token).then((userRecord) => {
            if (userRecord) {
                models.URL.findAll({
                    order: [
                        ['createdAt', 'DESC']
                    ],
                    include: [{
                        model: models.User,
                        where: {
                            token: req.query.token
                        }
                    }]
                }).then(URLs => {
                    if (URLs) {
                        // Let's process the urls, so we add the full link (for future custom domains per user in mind)
                        let outURLs = Array<JSON>();
                        URLs.map(URL => {
                            let URLJSON: any = {
                                shortURL: [req.app.get('config')['SSL'] ? 'https://' : 'http://', req.app.get('config')['defaultDomain'], '/', URL.shorterSuffix].join(''),
                                originalURL: URL.originalURL
                            };
                            outURLs.push(URLJSON);
                        });
                        res.json({
                            'status': 1,
                            'statusCode': 'user-urls/get',
                            'data': outURLs,
                        });
                        res.end()
                    } else {
                        res.status(400).json({
                            'status': 0,
                            'statusCode': 'user-urls/not-found',
                            'error': 'URLs for the user not found'
                        });
                        res.end();
                    }
                });
            } else {
                res.status(400).json({
                    'status': 0,
                    'statusCode': 'user-urls/not-logged',
                    'error': 'You need to be logged in!'
                });
                res.end();
            }
        });
    }
    catch (e) {
        next(e);
    }
});
index.get('/:suffix', async (req, res, next) => {
        try {
            const suffix = req.params.suffix;
            if (!suffix) {
                res.status(400).json({
                    'status': 0,
                    'statusCode': 'redirect/parameters-error',
                    'error': 'Check your URL!'
                });
                res.end();
                return;
            }
            //Check if is a static file of angular
            if (suffix.indexOf('.') !== -1) {
                res.sendFile(path.join(__dirname, '../../angular/dist/', suffix), {}, (err) => {
                    if (err) {
                        next(err);
                    } else {
                        res.end();
                        return;
                    }
                });
            } else {

                const IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                models.URL.find({
                    where: {
                        shorterSuffix: suffix
                    }
                }).then(URL => {
                    if (URL) {
                        models.URLStats.create({
                            userAgent: req.headers['user-agent'],
                            IP: IP,
                            URLId: URL.id
                        }).then(() => {
                            res.redirect(301, URL.originalURL);
                            res.end();
                        });
                    } else {
                        // URL not found, redirect to original URL.
                        res.redirect(301, [req.app.get('config')['SSL'] ? 'https://' : 'http://', req.app.get('config').defaultDomain].join(''));
                        res.end();
                    }
                });
            }
        }
        catch (e) {
            next(e);
        }
    }
);

index.post('/shorten', async (req, res, next) => {
        try {

            const IP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

            const createLink = (originalURL, token) => {
                console.log('shorten', 'originalURL', originalURL, 'token', token);
                const suffix = new Array(5).join().replace(/(.|$)/g, () => {
                    return ((Math.random() * 36) | 0).toString(36)[Math.random() < .5 ? "toString" : "toUpperCase"]();
                });

                const currentDomain = req.app.get('config').defaultDomain;

                const link = [req.app.get('config')['SSL'] ? 'https://' : 'http://', currentDomain, '/', suffix].join('');
                // Can't use findOrCreate because sequelize for typescript still don't support it very well.
                // So we gonna use the find method and then, create if needed.
                models.URL.find({
                    where: {
                        originalURL: originalURL
                    }
                }).then(URL => {
                    if (URL) {
                        res.json({
                            'status': 0,
                            'statusCode': 'shorten/already-exists',
                            'originalURL': URL.originalURL,
                            'shortURL': [req.app.get('config')['SSL'] ? 'https://' : 'http://', currentDomain, '/', URL.shorterSuffix].join('')
                        });
                        res.end();
                        return;
                    } else {
                        models.URL.create({
                            shorterSuffix: suffix,
                            originalURL: originalURL,
                            creationIP: IP,
                            creationUserString: req.headers['user-agent']
                        }).then(URL => {
                            if (URL) {
                                res.json({
                                    'status': 1,
                                    'statusCode': 'shorten/created',
                                    'originalURL': URL.originalURL,
                                    'shortURL': link
                                });
                                res.end();
                                if (token) {
                                    models.User.findOne({
                                        where: {
                                            token: token
                                        }
                                    }).then(User => {
                                        if (User) {
                                            URL.addUser(User);
                                        }
                                    });
                                }
                                return;
                            } else {
                                // This should never happen.
                                res.status(400).json({
                                    'status': 0,
                                    'statusCode': 'shorten/fail',
                                    'error': 'You\'re hacking!'
                                });
                                res.end();
                                return;
                            }
                        })
                    }
                });
            };
            const originalURL = req.body["url"];
            // check if we receive the token and validate.
            let token = req.body["token"];
            if (token && token.length < 1) {
                token = null;
            }
            if (!originalURL) {
                res.status(400).json({
                    'status': 0,
                    'statusCode': 'shorten/parameters-error',
                    'error': 'You need to specify the URL!'
                });
                res.end();
                return;
            }
            // Let's check if the given URL is actually an URL
            const isURL = (string) => {
                return /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(string);
            };

            if (!isURL(originalURL)) {
                res.status(400).json({
                    'status': 0,
                    'statusCode': 'shorten/bad-url',
                    'error': 'The URL specified is not really an URL, please check if you added the protocol (http or https)'
                });
                res.end();
                return;
            }
            const startDate = new Date();
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date();
            endDate.setHours(23, 59, 59, 999);

            if (token) {
                models.User.findOne({
                    where: {
                        token: token
                    }
                }).then(User => {
                    if (User) {

                        models.URL.findAndCountAll({
                            where: {
                                createdAt: {
                                    $between: [startDate.toISOString(), endDate.toISOString()]
                                }
                            },
                            include: [
                                {
                                    model: models.User,
                                    where: {
                                        token: token
                                    }
                                }
                            ]
                        }).then((URLs) => {
                            if (URLs.count > req.app.get('config')['userDailyLimit']) {
                                res.status(400).json({
                                    'status': 0,
                                    'statusCode': 'shorten/user-limit',
                                    'error': 'You have already ' + req.app.get('config')['userDailyLimit'] + ' links!'
                                });
                                res.end();
                                return;
                            } else {
                                createLink(originalURL, token);
                            }
                        });
                    } else {
                        res.status(400).json({
                            'status': 0,
                            'statusCode': 'shorten/user-not-found',
                            'error': 'User not found! check your token'
                        });
                        res.end();
                        return;
                    }
                });

            } else {
                models.URL.findAndCountAll({
                    where: {
                        creationIP: IP,
                        createdAt: {
                            $between: [startDate.toISOString(), endDate.toISOString()]
                        }
                    }
                }).then((URLs) => {
                    if (URLs.count > req.app.get('config')['guestDailyLimit']) {
                        res.status(400).json({
                            'status': 0,
                            'statusCode': 'shorten/guest-limit',
                            'error': 'You have already ' + req.app.get('config')['guestDailyLimit'] + ' links, register to get more!'
                        });
                        res.end();
                        return;
                    } else {
                        createLink(originalURL, null);
                    }
                });

            }
        }
        catch (e) {
            next(e);
        }
    }
);
