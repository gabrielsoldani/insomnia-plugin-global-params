# insomnia-plugin-global-params

Insomnia plugin to add query parameters to all requests.

## Getting started

After installing the plugin in your Insomnia settings panel, define an object under the key `GLOBAL_PARAMS` in your environment as shown in the example below.

```json
{
    "GLOBAL_PARAMS": {
        "account": "my_account"
    }
}
```

You can validate that the plugin successfully added your params to the resulting URL by right-clicking the request, choosing **Copy as cURL**, and inspecting your clipboard's contents.

With the environment shown above, a request to `GET https://www.example.org/` will result in the following cURL command:

```
curl --request GET \
  --url 'https://www.example.org/?account=my_account'
```

This request will **not** override any parameter defined in the URL or in the _Query_ tab.

For example, a request to `GET https://www.example.org/?account=root` with the environment shown above will result in:

```json
curl --request GET \
  --url 'https://www.example.org/?account=root'
```

## Disabling the plugin on a per-request basis

If you don't want this plugin to affect a request or a request group, you can right-click the request or request group and choose **Disable global params**. To enable again, you can select **Enable global params** instead.

**Important:** Disabling a request group is simply a **bulk action**: the group itself has no disabled state. This means if you disable a request group and add a new request to it later, this plugin will be **enabled** for the new request. Similarly, if you move a request between groups, the request will retain it's disabled state. This is due to a **limitation in Insomnia** and there's nothing we can do. More specifically, there's no way to retrieve a request's group as it's being filtered by the plugin to determine the group's state.

## License

See the included [LICENSE](LICENSE) file.
