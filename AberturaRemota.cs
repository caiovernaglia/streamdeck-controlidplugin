using StreamDeckLib;
using StreamDeckLib.Messages;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.IO;
using System.Net;
using System.Runtime.Serialization.Json;
using System.Linq;

namespace ControlID
{
  [ActionUuid(Uuid= "com.caiovernaglia.controlid.AberturaRemota")]
  public class AberturaRemota : BaseStreamDeckActionWithSettingsModel<Models.ControlIDSettingsModel>
  {
	public override async Task OnKeyUp(StreamDeckEventPayload args)
	{
            //execute login
            string uri = "http://" + SettingsModel.IP + "/login.fcgi";
            string uri_json = "{\"login\":\"" + SettingsModel.Username + "\",\"password\":\"" + SettingsModel.Password + "\"}";
            string response = WebJson.Send(uri, uri_json);

            if (response.Contains("session"))
            {
                SettingsModel.Session = response.Split('"')[3];
            }

            //execute command
            uri = "http://" + SettingsModel.IP + SettingsModel.EndPoint_Action + "?session=" + SettingsModel.Session;
            uri_json= "{\"actions\":[{\"action\":\"sec_box\",\"parameters\":\"id=65793,reason=3\"}]}";
            response = WebJson.Send(uri, uri_json);
            if(response!=null)
            {
                await Manager.ShowOkAsync(args.context);
            }

            //update settings
            await Manager.SetSettingsAsync(args.context, SettingsModel);
	}

	public override async Task OnDidReceiveSettings(StreamDeckEventPayload args)
	{
	  await base.OnDidReceiveSettings(args);
	}

	public override async Task OnWillAppear(StreamDeckEventPayload args)
	{
	  await base.OnWillAppear(args);
	}

  }
}
